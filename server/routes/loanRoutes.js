// routes/loanRoutes.js - Book Lending Endpoints
const express = require('express');
const router = express.Router();
const {
  issueBook,
  returnBook,
  getAllLoans,
  getMyLoans,
  deleteLoan,
} = require('../controllers/loanController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect); // All loan actions require authentication

// Current member's loans
router.get('/my', getMyLoans);

// Issue book (Librarians/Admins or Members)
router.post('/', issueBook);

// Return book
router.put('/:id/return', returnBook);

// All loans view (Librarian, Admin)
router.get('/', authorize('Librarian', 'Admin'), getAllLoans);

// Delete loan record (Admin only)
router.delete('/:id', authorize('Admin'), deleteLoan);

module.exports = router;
