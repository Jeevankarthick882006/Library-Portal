// controllers/bookController.js - Book CRUD, Search, and Category Filtering
const Book = require('../models/Book');

// @desc    Get all books with optional search, category filter, and sorting
// @route   GET /api/books
// @access  Public
const getBooks = async (req, res) => {
  try {
    const { search, category, sort } = req.query;

    let query = {};

    // Debounced Search filter (matches title, author, or ISBN case-insensitively)
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { author: searchRegex },
        { isbn: searchRegex },
      ];
    }

    // Category filter
    if (category && category.trim() !== '' && category.toLowerCase() !== 'all') {
      query.category = category.trim();
    }

    // Sorting option (default newest first)
    let sortOption = { createdAt: -1 };
    if (sort === 'title_asc') sortOption = { title: 1 };
    if (sort === 'title_desc') sortOption = { title: -1 };
    if (sort === 'available') sortOption = { availableCopies: -1 };

    const books = await Book.find(query).sort(sortOption);
    const total = await Book.countDocuments(query);

    res.json({
      success: true,
      count: books.length,
      total,
      books,
    });
  } catch (error) {
    console.error('getBooks error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get distinct list of book categories
// @route   GET /api/books/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Book.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single book by ID
// @route   GET /api/books/:id
// @access  Public
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new book
// @route   POST /api/books
// @access  Private (Librarian, Admin)
const createBook = async (req, res) => {
  try {
    const {
      title,
      author,
      isbn,
      category,
      totalCopies,
      availableCopies,
      description,
      publisher,
      publishedYear,
      coverImage,
    } = req.body;

    // Check if ISBN already exists
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({ message: 'A book with this ISBN already exists' });
    }

    const copies = Number(totalCopies) || 1;
    const avail = availableCopies !== undefined ? Number(availableCopies) : copies;

    const book = await Book.create({
      title,
      author,
      isbn,
      category,
      totalCopies: copies,
      availableCopies: avail,
      description: description || '',
      publisher: publisher || '',
      publishedYear: Number(publishedYear) || new Date().getFullYear(),
      coverImage: coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    });

    res.status(201).json(book);
  } catch (error) {
    console.error('createBook error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an existing book
// @route   PUT /api/books/:id
// @access  Private (Librarian, Admin)
const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const {
      title,
      author,
      isbn,
      category,
      totalCopies,
      availableCopies,
      description,
      publisher,
      publishedYear,
      coverImage,
    } = req.body;

    book.title = title || book.title;
    book.author = author || book.author;
    book.isbn = isbn || book.isbn;
    book.category = category || book.category;
    if (totalCopies !== undefined) book.totalCopies = Number(totalCopies);
    if (availableCopies !== undefined) book.availableCopies = Number(availableCopies);
    if (description !== undefined) book.description = description;
    if (publisher !== undefined) book.publisher = publisher;
    if (publishedYear !== undefined) book.publishedYear = Number(publishedYear);
    if (coverImage !== undefined) book.coverImage = coverImage;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private (Admin)
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await book.deleteOne();
    res.json({ message: 'Book successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBooks,
  getCategories,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
