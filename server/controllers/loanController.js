// controllers/loanController.js - Book Lending / Loan Management
const Loan = require('../models/Loan');
const Book = require('../models/Book');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Issue a book to a member (Borrow)
// @route   POST /api/loans
// @access  Private (Librarian, Admin, or Member self-borrow)
const issueBook = async (req, res) => {
  try {
    const { bookId, memberId, durationDays = 14, notes } = req.body;

    // If a Member is calling this, they can only issue books to themselves
    let targetMemberId = memberId;
    if (req.user.role === 'Member') {
      targetMemberId = req.user._id;
    }

    if (!targetMemberId) {
      return res.status(400).json({ message: 'Member ID is required' });
    }

    // 1. Verify Book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // 2. Check Book availability
    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: 'No copies of this book are currently available' });
    }

    // 3. Verify Member exists
    const member = await User.findById(targetMemberId);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // 4. Check if member already has an active loan for this same book
    const existingLoan = await Loan.findOne({
      book: bookId,
      member: targetMemberId,
      status: 'borrowed',
    });

    if (existingLoan) {
      return res.status(400).json({
        message: 'This member already has an active borrowed copy of this book',
      });
    }

    // 5. Calculate due date (default: 14 days from now)
    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(issueDate.getDate() + Number(durationDays));

    // 6. Create the loan record
    const loan = await Loan.create({
      book: book._id,
      member: member._id,
      issueDate,
      dueDate,
      status: 'borrowed',
      notes: notes || '',
    });

    // 7. Decrement available copies of the book
    book.availableCopies -= 1;
    await book.save();

    // 8. Create a notification for the member
    await Notification.create({
      user: member._id,
      title: 'Book Borrowed Successfully',
      message: `You borrowed "${book.title}". Please return it by ${dueDate.toLocaleDateString()}.`,
      type: 'info',
    });

    // Return populated loan record
    const populatedLoan = await Loan.findById(loan._id)
      .populate('book', 'title author isbn coverImage')
      .populate('member', 'name email memberCode');

    res.status(201).json(populatedLoan);
  } catch (error) {
    console.error('issueBook error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Return a borrowed book
// @route   PUT /api/loans/:id/return
// @access  Private (Librarian, Admin, or Member)
const returnBook = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id)
      .populate('book')
      .populate('member');

    if (!loan) {
      return res.status(404).json({ message: 'Loan record not found' });
    }

    if (loan.status === 'returned') {
      return res.status(400).json({ message: 'This book has already been returned' });
    }

    const returnDate = new Date();
    loan.returnDate = returnDate;
    loan.status = 'returned';

    // Calculate fine if returned after due date ($1 or ₹10 per day overdue)
    if (returnDate > loan.dueDate) {
      const diffTime = Math.abs(returnDate - loan.dueDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      loan.fineAmount = diffDays * 10; // Rs. 10 / day fine
    }

    await loan.save();

    // Increment available copies of the book back
    if (loan.book) {
      const book = await Book.findById(loan.book._id);
      if (book) {
        book.availableCopies += 1;
        // Don't exceed total copies
        if (book.availableCopies > book.totalCopies) {
          book.availableCopies = book.totalCopies;
        }
        await book.save();
      }
    }

    // Create return notification
    if (loan.member) {
      await Notification.create({
        user: loan.member._id,
        title: 'Book Returned',
        message: `"${loan.book.title}" was returned successfully.${
          loan.fineAmount > 0 ? ` Overdue fine: ₹${loan.fineAmount}` : ''
        }`,
        type: loan.fineAmount > 0 ? 'warning' : 'success',
      });
    }

    res.json({
      message: 'Book returned successfully',
      loan,
    });
  } catch (error) {
    console.error('returnBook error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all loans (with optional status filter)
// @route   GET /api/loans
// @access  Private (Librarian, Admin)
const getAllLoans = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    const loans = await Loan.find(query)
      .populate('book', 'title author isbn coverImage category')
      .populate('member', 'name email memberCode phone')
      .sort({ createdAt: -1 });

    // Automatically check and update overdue status dynamically
    const now = new Date();
    for (let l of loans) {
      if (l.status === 'borrowed' && new Date(l.dueDate) < now) {
        l.status = 'overdue';
        await Loan.findByIdAndUpdate(l._id, { status: 'overdue' });
      }
    }

    // Optional text filter on book title or member name
    let filteredLoans = loans;
    if (search && search.trim() !== '') {
      const q = search.toLowerCase();
      filteredLoans = loans.filter(
        (l) =>
          (l.book && l.book.title.toLowerCase().includes(q)) ||
          (l.member && l.member.name.toLowerCase().includes(q)) ||
          (l.member && l.member.memberCode && l.member.memberCode.toLowerCase().includes(q))
      );
    }

    res.json(filteredLoans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user's loans
// @route   GET /api/loans/my
// @access  Private (Member, Librarian, Admin)
const getMyLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ member: req.user._id })
      .populate('book', 'title author isbn coverImage category')
      .sort({ createdAt: -1 });

    // Check overdue
    const now = new Date();
    for (let l of loans) {
      if (l.status === 'borrowed' && new Date(l.dueDate) < now) {
        l.status = 'overdue';
        await Loan.findByIdAndUpdate(l._id, { status: 'overdue' });
      }
    }

    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a loan record
// @route   DELETE /api/loans/:id
// @access  Private (Admin)
const deleteLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    // If loan is still marked borrowed, restore book copy before deleting
    if (loan.status === 'borrowed') {
      await Book.findByIdAndUpdate(loan.book, { $inc: { availableCopies: 1 } });
    }

    await loan.deleteOne();
    res.json({ message: 'Loan record deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  issueBook,
  returnBook,
  getAllLoans,
  getMyLoans,
  deleteLoan,
};
