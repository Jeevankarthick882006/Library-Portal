// controllers/memberController.js - Member Management Controllers
const User = require('../models/User');
const Loan = require('../models/Loan');

// @desc    Get all members with optional search
// @route   GET /api/members
// @access  Private (Librarian, Admin)
const getAllMembers = async (req, res) => {
  try {
    const { search, role, status } = req.query;
    let query = {};

    if (role && role !== 'All') {
      query.role = role;
    }

    if (status && status !== 'All') {
      query.membershipStatus = status;
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { memberCode: searchRegex },
        { phone: searchRegex },
      ];
    }

    const members = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get member by ID with their active loans
// @route   GET /api/members/:id
// @access  Private (Librarian, Admin)
const getMemberById = async (req, res) => {
  try {
    const member = await User.findById(req.params.id).select('-password');
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // Also fetch their loans
    const loans = await Loan.find({ member: member._id })
      .populate('book', 'title author isbn coverImage')
      .sort({ createdAt: -1 });

    res.json({
      member,
      loans,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new member manually by Librarian/Admin
// @route   POST /api/members
// @access  Private (Librarian, Admin)
const createMember = async (req, res) => {
  try {
    const { name, email, password, role, phone, address } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    const assignedRole = role || 'Member';
    let memberCode;
    if (assignedRole === 'Member') {
      const count = await User.countDocuments({ role: 'Member' });
      memberCode = `LIB-M${String(count + 1).padStart(4, '0')}`;
    }

    const member = await User.create({
      name,
      email,
      password: password || 'member123',
      role: assignedRole,
      memberCode,
      phone: phone || '',
      address: address || '',
    });

    res.status(201).json({
      _id: member._id,
      name: member.name,
      email: member.email,
      role: member.role,
      memberCode: member.memberCode,
      phone: member.phone,
      address: member.address,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update member details
// @route   PUT /api/members/:id
// @access  Private (Librarian, Admin)
const updateMember = async (req, res) => {
  try {
    const member = await User.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const { name, email, role, phone, address, membershipStatus } = req.body;

    if (name) member.name = name;
    if (email) member.email = email;
    if (role) member.role = role;
    if (phone !== undefined) member.phone = phone;
    if (address !== undefined) member.address = address;
    if (membershipStatus) member.membershipStatus = membershipStatus;

    const updated = await member.save();
    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      memberCode: updated.memberCode,
      phone: updated.phone,
      address: updated.address,
      membershipStatus: updated.membershipStatus,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete member
// @route   DELETE /api/members/:id
// @access  Private (Admin)
const deleteMember = async (req, res) => {
  try {
    const member = await User.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // Check if member has unreturned books
    const activeLoans = await Loan.countDocuments({
      member: member._id,
      status: 'borrowed',
    });

    if (activeLoans > 0) {
      return res.status(400).json({
        message: 'Cannot delete member with active borrowed books. Return books first.',
      });
    }

    await member.deleteOne();
    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
};
