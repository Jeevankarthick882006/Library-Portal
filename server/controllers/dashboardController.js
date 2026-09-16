// controllers/dashboardController.js - Dashboard Metrics Aggregator
const Book = require('../models/Book');
const User = require('../models/User');
const Loan = require('../models/Loan');

// @desc    Get dashboard statistics based on user role
// @route   GET /api/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const userRole = req.user.role;
    const userId = req.user._id;

    if (userRole === 'Member') {
      // Member-specific dashboard
      const myLoans = await Loan.find({ member: userId })
        .populate('book', 'title author coverImage isbn category')
        .sort({ createdAt: -1 });

      const activeLoans = myLoans.filter((l) => l.status === 'borrowed');
      const overdueLoans = myLoans.filter((l) => l.status === 'overdue');
      const returnedLoans = myLoans.filter((l) => l.status === 'returned');

      return res.json({
        role: 'Member',
        stats: {
          activeCount: activeLoans.length,
          overdueCount: overdueLoans.length,
          returnedCount: returnedLoans.length,
          totalBorrowed: myLoans.length,
        },
        activeLoans,
        recentLoans: myLoans.slice(0, 5),
      });
    }

    // Admin and Librarian dashboard
    const [
      totalBooks,
      totalMembers,
      activeLoansCount,
      overdueLoansCount,
      returnedLoansCount,
      recentLoans,
      recentBooks,
    ] = await Promise.all([
      Book.countDocuments(),
      User.countDocuments({ role: 'Member' }),
      Loan.countDocuments({ status: 'borrowed' }),
      Loan.countDocuments({ status: 'overdue' }),
      Loan.countDocuments({ status: 'returned' }),
      Loan.find()
        .populate('book', 'title author coverImage')
        .populate('member', 'name email memberCode')
        .sort({ createdAt: -1 })
        .limit(5),
      Book.find().sort({ createdAt: -1 }).limit(5),
    ]);

    // Calculate total copies and available copies sum
    const booksAggregation = await Book.aggregate([
      {
        $group: {
          _id: null,
          totalCopiesSum: { $sum: '$totalCopies' },
          availableCopiesSum: { $sum: '$availableCopies' },
        },
      },
    ]);

    const totalCopies = booksAggregation[0]?.totalCopiesSum || 0;
    const availableCopies = booksAggregation[0]?.availableCopiesSum || 0;

    res.json({
      role: userRole,
      stats: {
        totalBooks,
        totalCopies,
        availableCopies,
        issuedCopies: totalCopies - availableCopies,
        totalMembers,
        activeLoans: activeLoansCount,
        overdueLoans: overdueLoansCount,
        returnedLoans: returnedLoansCount,
      },
      recentLoans,
      recentBooks,
    });
  } catch (error) {
    console.error('getDashboardStats error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
