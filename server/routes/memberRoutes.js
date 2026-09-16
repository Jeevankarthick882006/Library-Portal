// routes/memberRoutes.js - Member Management Endpoints
const express = require('express');
const router = express.Router();
const {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
} = require('../controllers/memberController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All member management routes require authentication
router.use(protect);

router.get('/', authorize('Librarian', 'Admin'), getAllMembers);
router.post('/', authorize('Librarian', 'Admin'), createMember);
router.get('/:id', authorize('Librarian', 'Admin'), getMemberById);
router.put('/:id', authorize('Librarian', 'Admin'), updateMember);
router.delete('/:id', authorize('Admin'), deleteMember);

module.exports = router;
