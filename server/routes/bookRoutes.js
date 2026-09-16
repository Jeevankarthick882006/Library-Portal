// routes/bookRoutes.js - Book Catalog Endpoints
const express = require('express');
const router = express.Router();
const {
  getBooks,
  getCategories,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} = require('../controllers/bookController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public catalog access
router.get('/', getBooks);
router.get('/categories', getCategories);
router.get('/:id', getBookById);

// Staff restricted operations
router.post('/', protect, authorize('Librarian', 'Admin'), createBook);
router.put('/:id', protect, authorize('Librarian', 'Admin'), updateBook);
router.delete('/:id', protect, authorize('Admin'), deleteBook);

module.exports = router;
