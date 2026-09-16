# Library Portal - Complete Source Code Repository

This document contains the complete, unedited source code for all modules, configuration files, backend APIs, and React frontend components developed for the **Library Portal** MERN stack project.

---

## 📑 Table of Contents

### 1. Root Configuration
- [`package.json`](#1-root-packagejson)

### 2. Backend Server (`server/`)
- [`server/package.json`](#2-serverpackagejson)
- [`server/.env`](#3-serverenv)
- [`server/server.js`](#4-serverserverjs)
- [`server/config/db.js`](#5-serverconfigdbjs)
- [`server/models/User.js`](#6-servermodelsuserjs)
- [`server/models/Book.js`](#7-servermodelsbookjs)
- [`server/models/Loan.js`](#8-servermodelsloanjs)
- [`server/models/Notification.js`](#9-servermodelsnotificationjs)
- [`server/middleware/authMiddleware.js`](#10-servermiddlewareauthmiddlewarejs)
- [`server/controllers/authController.js`](#11-servercontrollersauthcontrollerjs)
- [`server/controllers/bookController.js`](#12-servercontrollersbookcontrollerjs)
- [`server/controllers/memberController.js`](#13-servercontrollersmembercontrollerjs)
- [`server/controllers/loanController.js`](#14-servercontrollersloancontrollerjs)
- [`server/controllers/dashboardController.js`](#15-servercontrollersdashboardcontrollerjs)
- [`server/controllers/notificationController.js`](#16-servercontrollersnotificationcontrollerjs)
- [`server/routes/authRoutes.js`](#17-serverroutesauthroutesjs)
- [`server/routes/bookRoutes.js`](#18-serverroutesbookroutesjs)
- [`server/routes/memberRoutes.js`](#19-serverroutesmemberroutesjs)
- [`server/routes/loanRoutes.js`](#20-serverroutesloanroutesjs)
- [`server/routes/dashboardRoutes.js`](#21-serverroutesdashboardroutesjs)
- [`server/routes/notificationRoutes.js`](#22-serverroutesnotificationroutesjs)
- [`server/seed.js`](#23-serverseedjs)

### 3. Frontend Client (`client/`)
- [`client/package.json`](#24-clientpackagejson)
- [`client/vite.config.js`](#25-clientviteconfigjs)
- [`client/index.html`](#26-clientindexhtml)
- [`client/src/index.css`](#27-clientsrcindexcss)
- [`client/src/main.jsx`](#28-clientsrcmainjsx)
- [`client/src/App.jsx`](#29-clientsrcappjsx)
- [`client/src/services/api.js`](#30-clientsrcservicesapijs)
- [`client/src/hooks/useDebounce.js`](#31-clientsrchooksusedebouncejs)
- [`client/src/context/AuthContext.jsx`](#32-clientsrccontextauthcontextjsx)
- [`client/src/components/Navbar.jsx`](#33-clientsrccomponentsnavbarjsx)
- [`client/src/components/Footer.jsx`](#34-clientsrccomponentsfooterjsx)
- [`client/src/components/ProtectedRoute.jsx`](#35-clientsrccomponentsprotectedroutejsx)
- [`client/src/components/StatCard.jsx`](#36-clientsrccomponentsstatcardjsx)
- [`client/src/pages/Home.jsx`](#37-clientsrcpageshomejsx)
- [`client/src/pages/Login.jsx`](#38-clientsrcpagesloginjsx)
- [`client/src/pages/Register.jsx`](#39-clientsrcpagesregisterjsx)
- [`client/src/pages/Dashboard.jsx`](#40-clientsrcpagesdashboardjsx)
- [`client/src/pages/BooksList.jsx`](#41-clientsrcpagesbookslistjsx)
- [`client/src/pages/BookDetails.jsx`](#42-clientsrcpagesbookdetailsjsx)
- [`client/src/pages/BookForm.jsx`](#43-clientsrcpagesbookformjsx)
- [`client/src/pages/LoansList.jsx`](#44-clientsrcpagesloanslistjsx)
- [`client/src/pages/MembersList.jsx`](#45-clientsrcpagesmemberslistjsx)
- [`client/src/pages/Profile.jsx`](#46-clientsrcpagesprofilejsx)

---

## 1. Root `package.json`
```json
{
  "name": "library-portal",
  "version": "1.0.0",
  "description": "Library Portal - MERN Stack Project for College / Final Year",
  "scripts": {
    "install:server": "npm install --prefix server",
    "install:client": "npm install --prefix client",
    "install:all": "npm install --prefix server && npm install --prefix client",
    "seed": "npm run seed --prefix server",
    "server": "npm run dev --prefix server",
    "client": "npm run dev --prefix client",
    "dev": "concurrently \"npm run server\" \"npm run client\""
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

---

## 2. `server/package.json`
```json
{
  "name": "library-portal-server",
  "version": "1.0.0",
  "description": "Backend API for Library Portal using Node, Express, and MongoDB",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node seed.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.4.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.3"
  }
}
```

---

## 3. `server/.env`
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/library_portal
JWT_SECRET=supersecret_libraryportal_jwt_key_2026
NODE_ENV=development
```

---

## 4. `server/server.js`
```javascript
// server.js - Main Express Application Server
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors()); // Allow Cross-Origin requests from React frontend
app.use(express.json()); // Parse incoming JSON request bodies
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/members', require('./routes/memberRoutes'));
app.use('/api/loans', require('./routes/loanRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Fallback for unmatched routes
app.use((req, res, next) => {
  res.status(404).json({ message: `Cannot ${req.method} ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Library Portal Server] running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
```

---

## 5. `server/config/db.js`
```javascript
// config/db.js - MongoDB Connection Configuration
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/library_portal');
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
```

---

## 6. `server/models/User.js`
```javascript
// models/User.js - User and Member Schema
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['Member', 'Librarian', 'Admin'],
      default: 'Member',
    },
    memberCode: {
      type: String,
      unique: true,
      sparse: true, // Allows null/empty for admins without collision
    },
    phone: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    membershipStatus: {
      type: String,
      enum: ['Active', 'Suspended', 'Expired'],
      default: 'Active',
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Hash password before saving to the database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

---

## 7. `server/models/Book.js`
```javascript
// models/Book.js - Book Schema for Inventory Management
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please enter the book title'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Please enter the author name'],
      trim: true,
    },
    isbn: {
      type: String,
      required: [true, 'Please enter the ISBN number'],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please select a book category'],
      trim: true,
    },
    totalCopies: {
      type: Number,
      required: [true, 'Please enter total number of copies'],
      min: 1,
      default: 1,
    },
    availableCopies: {
      type: Number,
      required: true,
      min: 0,
      default: 1,
    },
    description: {
      type: String,
      default: '',
    },
    publisher: {
      type: String,
      default: '',
    },
    publishedYear: {
      type: Number,
      default: new Date().getFullYear(),
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Book', bookSchema);
```

---

## 8. `server/models/Loan.js`
```javascript
// models/Loan.js - Loan / Book Lending Schema
const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['borrowed', 'returned', 'overdue'],
      default: 'borrowed',
    },
    fineAmount: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Loan', loanSchema);
```

---

## 9. `server/models/Notification.js`
```javascript
// models/Notification.js - User Notifications Schema
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['info', 'warning', 'success', 'danger'],
      default: 'info',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Notification', notificationSchema);
```

---

## 10. `server/middleware/authMiddleware.js`
```javascript
// middleware/authMiddleware.js - Authentication & Role Authorization Middleware
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes: ensures only logged-in users with a valid JWT token can access
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in Authorization header: "Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from header string
      token = req.headers.authorization.split(' ')[1];

      // Verify the JWT signature using secret key
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'supersecret_libraryportal_jwt_key_2026'
      );

      // Find user from decoded payload (exclude hashed password from req.user)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next(); // Continue to the next controller
    } catch (error) {
      console.error('JWT verification error:', error.message);
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Authorize roles: restricts access to specific roles (e.g. 'Admin', 'Librarian')
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role '${req.user ? req.user.role : 'Guest'}' is not authorized to access this resource`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
```

---

## 11. `server/controllers/authController.js`
```javascript
// controllers/authController.js - Authentication Controllers (Register, Login, Profile)
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper function to generate a signed JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecret_libraryportal_jwt_key_2026', {
    expiresIn: '30d',
  });
};

// Register a new user / member
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, address } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    const assignedRole = role || 'Member';
    let memberCode = undefined;
    if (assignedRole === 'Member') {
      const count = await User.countDocuments({ role: 'Member' });
      memberCode = `LIB-M${String(count + 1).padStart(4, '0')}`;
    }

    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
      memberCode,
      phone: phone || '',
      address: address || '',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        memberCode: user.memberCode,
        phone: user.phone,
        address: user.address,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data received' });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

// Authenticate user & get token (Login)
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        memberCode: user.memberCode,
        phone: user.phone,
        address: user.address,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
      user.address = req.body.address !== undefined ? req.body.address : user.address;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        memberCode: updatedUser.memberCode,
        phone: updatedUser.phone,
        address: updatedUser.address,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
};
```

---

## 12. `server/controllers/bookController.js`
```javascript
// controllers/bookController.js - Book CRUD, Search, and Category Filtering
const Book = require('../models/Book');

// Get all books with optional search, category filter, and sorting
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

// Get distinct list of book categories
const getCategories = async (req, res) => {
  try {
    const categories = await Book.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single book by ID
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

// Create a new book
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

// Update an existing book
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

// Delete a book
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
```

---

## 13. `server/controllers/memberController.js`
```javascript
// controllers/memberController.js - Member Management Controllers
const User = require('../models/User');
const Loan = require('../models/Loan');

// Get all members with optional search
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

// Get member by ID with their active loans
const getMemberById = async (req, res) => {
  try {
    const member = await User.findById(req.params.id).select('-password');
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

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

// Create a new member manually by Librarian/Admin
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

// Update member details
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

// Delete member
const deleteMember = async (req, res) => {
  try {
    const member = await User.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

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
```

---

## 14. `server/controllers/loanController.js`
```javascript
// controllers/loanController.js - Book Lending / Loan Management
const Loan = require('../models/Loan');
const Book = require('../models/Book');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Issue a book to a member (Borrow)
const issueBook = async (req, res) => {
  try {
    const { bookId, memberId, durationDays = 14, notes } = req.body;

    let targetMemberId = memberId;
    if (req.user.role === 'Member') {
      targetMemberId = req.user._id;
    }

    if (!targetMemberId) {
      return res.status(400).json({ message: 'Member ID is required' });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: 'No copies of this book are currently available' });
    }

    const member = await User.findById(targetMemberId);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

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

    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(issueDate.getDate() + Number(durationDays));

    const loan = await Loan.create({
      book: book._id,
      member: member._id,
      issueDate,
      dueDate,
      status: 'borrowed',
      notes: notes || '',
    });

    // Decrement stock
    book.availableCopies -= 1;
    await book.save();

    // Create notification
    await Notification.create({
      user: member._id,
      title: 'Book Borrowed Successfully',
      message: `You borrowed "${book.title}". Please return it by ${dueDate.toLocaleDateString()}.`,
      type: 'info',
    });

    const populatedLoan = await Loan.findById(loan._id)
      .populate('book', 'title author isbn coverImage')
      .populate('member', 'name email memberCode');

    res.status(201).json(populatedLoan);
  } catch (error) {
    console.error('issueBook error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Return a borrowed book
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

    // Calculate fine if overdue (Rs. 10 per day overdue)
    if (returnDate > loan.dueDate) {
      const diffTime = Math.abs(returnDate - loan.dueDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      loan.fineAmount = diffDays * 10;
    }

    await loan.save();

    // Increment book available copies
    if (loan.book) {
      const book = await Book.findById(loan.book._id);
      if (book) {
        book.availableCopies += 1;
        if (book.availableCopies > book.totalCopies) {
          book.availableCopies = book.totalCopies;
        }
        await book.save();
      }
    }

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

// Get all loans
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

    const now = new Date();
    for (let l of loans) {
      if (l.status === 'borrowed' && new Date(l.dueDate) < now) {
        l.status = 'overdue';
        await Loan.findByIdAndUpdate(l._id, { status: 'overdue' });
      }
    }

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

// Get current user's loans
const getMyLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ member: req.user._id })
      .populate('book', 'title author isbn coverImage category')
      .sort({ createdAt: -1 });

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

// Delete a loan record
const deleteLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

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
```

---

## 15. `server/controllers/dashboardController.js`
```javascript
// controllers/dashboardController.js - Dashboard Metrics Aggregator
const Book = require('../models/Book');
const User = require('../models/User');
const Loan = require('../models/Loan');

const getDashboardStats = async (req, res) => {
  try {
    const userRole = req.user.role;
    const userId = req.user._id;

    if (userRole === 'Member') {
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
```

---

## 16. `server/controllers/notificationController.js`
```javascript
// controllers/notificationController.js - Notification Controller
const Notification = require('../models/Notification');

const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.isRead = true;
    await notification.save();
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
};
```

---

## 17. `server/routes/authRoutes.js`
```javascript
const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
```

---

## 18. `server/routes/bookRoutes.js`
```javascript
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

router.get('/', getBooks);
router.get('/categories', getCategories);
router.get('/:id', getBookById);

router.post('/', protect, authorize('Librarian', 'Admin'), createBook);
router.put('/:id', protect, authorize('Librarian', 'Admin'), updateBook);
router.delete('/:id', protect, authorize('Admin'), deleteBook);

module.exports = router;
```

---

## 19. `server/routes/memberRoutes.js`
```javascript
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

router.use(protect);
router.get('/', authorize('Librarian', 'Admin'), getAllMembers);
router.post('/', authorize('Librarian', 'Admin'), createMember);
router.get('/:id', authorize('Librarian', 'Admin'), getMemberById);
router.put('/:id', authorize('Librarian', 'Admin'), updateMember);
router.delete('/:id', authorize('Admin'), deleteMember);

module.exports = router;
```

---

## 20. `server/routes/loanRoutes.js`
```javascript
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

router.use(protect);
router.get('/my', getMyLoans);
router.post('/', issueBook);
router.put('/:id/return', returnBook);
router.get('/', authorize('Librarian', 'Admin'), getAllLoans);
router.delete('/:id', authorize('Admin'), deleteLoan);

module.exports = router;
```

---

## 21. `server/routes/dashboardRoutes.js`
```javascript
const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getDashboardStats);

module.exports = router;
```

---

## 22. `server/routes/notificationRoutes.js`
```javascript
const express = require('express');
const router = express.Router();
const {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', getMyNotifications);
router.put('/:id/read', markAsRead);
router.put('/read-all', markAllAsRead);

module.exports = router;
```

---

## 23. `server/seed.js`
```javascript
// seed.js - Database Seeder Script for Sample Data
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Book = require('./models/Book');
const Loan = require('./models/Loan');
const Notification = require('./models/Notification');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/library_portal';
    await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB for seeding: ${mongoUri}`);

    await User.deleteMany();
    await Book.deleteMany();
    await Loan.deleteMany();
    await Notification.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const librarianPassword = await bcrypt.hash('librarian123', salt);
    const memberPassword = await bcrypt.hash('member123', salt);

    const users = await User.insertMany([
      {
        name: 'System Admin',
        email: 'admin@library.com',
        password: adminPassword,
        role: 'Admin',
        phone: '+1 (555) 019-2831',
        address: 'Administrative HQ, Suite 400',
        membershipStatus: 'Active',
      },
      {
        name: 'Eleanor Vance',
        email: 'librarian@library.com',
        password: librarianPassword,
        role: 'Librarian',
        phone: '+1 (555) 014-9922',
        address: 'Library Main Desk, Floor 1',
        membershipStatus: 'Active',
      },
      {
        name: 'Alex Turner',
        email: 'member@library.com',
        password: memberPassword,
        role: 'Member',
        memberCode: 'LIB-M0001',
        phone: '+1 (555) 234-5678',
        address: '742 Evergreen Terrace',
        membershipStatus: 'Active',
      },
      {
        name: 'Sarah Connor',
        email: 'sarah@library.com',
        password: memberPassword,
        role: 'Member',
        memberCode: 'LIB-M0002',
        phone: '+1 (555) 987-6543',
        address: '101 Cyberdyne Way',
        membershipStatus: 'Active',
      },
    ]);

    const alexMember = users[2];
    const sarahMember = users[3];

    const books = await Book.insertMany([
      {
        title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        author: 'Robert C. Martin',
        isbn: '978-0132350884',
        category: 'Computer Science',
        totalCopies: 5,
        availableCopies: 4,
        publisher: 'Prentice Hall',
        publishedYear: 2008,
        description: 'Even bad code can function. But if code isn’t clean, it can bring a development organization to its knees.',
        coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      },
      {
        title: 'Designing Data-Intensive Applications',
        author: 'Martin Kleppmann',
        isbn: '978-1449373320',
        category: 'Computer Science',
        totalCopies: 4,
        availableCopies: 3,
        publisher: "O'Reilly Media",
        publishedYear: 2017,
        description: 'The definitive guide to the architecture of data systems, covering distributed storage and stream processing.',
        coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
      },
      {
        title: 'Eloquent JavaScript: A Modern Introduction',
        author: 'Marijn Haverbeke',
        isbn: '978-1593279509',
        category: 'Computer Science',
        totalCopies: 6,
        availableCopies: 6,
        publisher: 'No Starch Press',
        publishedYear: 2018,
        description: 'A thorough and beautiful introduction to JavaScript programming, from basics to backend concepts.',
        coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
      },
      {
        title: '1984',
        author: 'George Orwell',
        isbn: '978-0451524935',
        category: 'Literature & Fiction',
        totalCopies: 4,
        availableCopies: 3,
        publisher: 'Signet Classic',
        publishedYear: 1949,
        description: 'A dystopian masterpiece focusing on surveillance, state power, and the resilient human spirit.',
        coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
      },
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        isbn: '978-0060935467',
        category: 'Literature & Fiction',
        totalCopies: 3,
        availableCopies: 3,
        publisher: 'Harper Perennial',
        publishedYear: 1960,
        description: 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.',
        coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
      },
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        isbn: '978-0743273565',
        category: 'Literature & Fiction',
        totalCopies: 5,
        availableCopies: 5,
        publisher: 'Scribner',
        publishedYear: 1925,
        description: 'The exemplary novel of the Jazz Age, capturing the American dream and glamour in 1920s Long Island.',
        coverImage: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=600&auto=format&fit=crop&q=80',
      },
      {
        title: 'Sapiens: A Brief History of Humankind',
        author: 'Yuval Noah Harari',
        isbn: '978-0062316097',
        category: 'Science & History',
        totalCopies: 4,
        availableCopies: 4,
        publisher: 'Harper',
        publishedYear: 2015,
        description: 'A groundbreaking exploration of how biology and history have defined us and enhanced our understanding of humans.',
        coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=80',
      },
      {
        title: 'A Brief History of Time',
        author: 'Stephen Hawking',
        isbn: '978-0553380163',
        category: 'Science & History',
        totalCopies: 3,
        availableCopies: 3,
        publisher: 'Bantam',
        publishedYear: 1988,
        description: 'A landmark volume exploring black holes, time travel, and the origins of the cosmos.',
        coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
      },
      {
        title: 'Atomic Habits',
        author: 'James Clear',
        isbn: '978-0735211292',
        category: 'Self Help & Business',
        totalCopies: 7,
        availableCopies: 7,
        publisher: 'Avery',
        publishedYear: 2018,
        description: 'A proven framework for improving every day with small changes that lead to remarkable results.',
        coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
      },
      {
        title: 'The Psychology of Money',
        author: 'Morgan Housel',
        isbn: '978-0857197689',
        category: 'Self Help & Business',
        totalCopies: 4,
        availableCopies: 4,
        publisher: 'Harriman House',
        publishedYear: 2020,
        description: 'Timeless lessons on wealth, greed, and happiness doing well with money.',
        coverImage: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=600&auto=format&fit=crop&q=80',
      },
    ]);

    const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
    const fourDaysInFuture = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000);
    const twentyDaysAgo = new Date(Date.now() - 20 * 24 * 60 * 60 * 1000);
    const sixDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);

    await Loan.create({
      book: books[0]._id,
      member: alexMember._id,
      issueDate: tenDaysAgo,
      dueDate: fourDaysInFuture,
      status: 'borrowed',
      notes: 'Issued at desk 1',
    });

    await Loan.create({
      book: books[1]._id,
      member: sarahMember._id,
      issueDate: twentyDaysAgo,
      dueDate: sixDaysAgo,
      status: 'overdue',
      notes: 'Overdue reminder dispatched',
    });

    await Loan.create({
      book: books[3]._id,
      member: alexMember._id,
      issueDate: twentyDaysAgo,
      dueDate: sixDaysAgo,
      returnDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: 'returned',
      fineAmount: 0,
      notes: 'Returned in pristine condition',
    });

    await Notification.insertMany([
      {
        user: alexMember._id,
        title: 'Welcome to Library Portal!',
        message: 'Your member account is active. Browse books and manage your loans easily.',
        type: 'success',
      },
      {
        user: alexMember._id,
        title: 'Upcoming Book Due Date',
        message: 'Clean Code is due in 4 days. Remember to return or renew in time.',
        type: 'warning',
      },
      {
        user: sarahMember._id,
        title: 'Overdue Notice',
        message: 'Designing Data-Intensive Applications is past its due date. Please return as soon as possible.',
        type: 'danger',
      },
    ]);

    console.log('--- Seed Completed Successfully! ---');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
```

---

## 24. `client/package.json`
```json
{
  "name": "library-portal-client",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.7.2",
    "bootstrap": "^5.3.3",
    "bootstrap-icons": "^1.11.3",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.23.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "vite": "^5.2.11"
  }
}
```

---

## 25. `client/vite.config.js`
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```

---

## 26. `client/index.html`
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Library Portal - Knowledge & Lending System</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

## 27. `client/src/index.css`
```css
body {
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f8fafc;
  color: #1e293b;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

#root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1 0 auto;
}

.navbar-custom {
  background: #0f172a;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
}

.book-card {
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.book-card .card-img-top {
  height: 220px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.book-card:hover .card-img-top {
  transform: scale(1.03);
}

.stat-card {
  border-radius: 14px;
  border: none;
  background: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.category-pill {
  border-radius: 20px;
  padding: 6px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-pill.active {
  background-color: #3b82f6 !important;
  color: white !important;
  border-color: #3b82f6 !important;
}

.quick-login-btn {
  font-size: 0.82rem;
  padding: 5px 12px;
  border-radius: 6px;
}
```

---

## 28. `client/src/main.jsx`
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## 29. `client/src/App.jsx`
```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BooksList from './pages/BooksList';
import BookDetails from './pages/BookDetails';
import BookForm from './pages/BookForm';
import LoansList from './pages/LoansList';
import MembersList from './pages/MembersList';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/books" element={<BooksList />} />
            <Route path="/books/:id" element={<BookDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/loans"
              element={
                <ProtectedRoute allowedRoles={['Librarian', 'Admin']}>
                  <LoansList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/members"
              element={
                <ProtectedRoute allowedRoles={['Librarian', 'Admin']}>
                  <MembersList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/books/new"
              element={
                <ProtectedRoute allowedRoles={['Librarian', 'Admin']}>
                  <BookForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/books/:id/edit"
              element={
                <ProtectedRoute allowedRoles={['Librarian', 'Admin']}>
                  <BookForm />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;
```

---

## 30. `client/src/services/api.js`
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const token = localStorage.getItem('token');
      if (token) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 31. `client/src/hooks/useDebounce.js`
```javascript
import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce a fast-changing value (e.g. search input).
 * Waits 400ms after user stops typing before returning updated value.
 */
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
```

---

## 32. `client/src/context/AuthContext.jsx`
```javascript
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (e) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setUser(data);
    setToken(data.token);
    localStorage.setItem('user', JSON.stringify(data));
    localStorage.setItem('token', data.token);
    return data;
  };

  const register = async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    setUser(data);
    setToken(data.token);
    localStorage.setItem('user', JSON.stringify(data));
    localStorage.setItem('token', data.token);
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const updateUser = (updatedUser) => {
    const merged = { ...user, ...updatedUser };
    setUser(merged);
    localStorage.setItem('user', JSON.stringify(merged));
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'Admin';
  const isLibrarian = user?.role === 'Librarian';
  const isMember = user?.role === 'Member';
  const isStaff = isAdmin || isLibrarian;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        isLibrarian,
        isMember,
        isStaff,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
```

---

## 33. `client/src/components/Navbar.jsx`
```javascript
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Navbar = () => {
  const { user, isAuthenticated, isStaff, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated, location.pathname]);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
    } catch (e) {}
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (e) {}
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const isActive = (path) => (location.pathname === path ? 'active text-primary fw-bold' : 'text-light');

  const getRoleBadgeClass = (role) => {
    if (role === 'Admin') return 'bg-danger';
    if (role === 'Librarian') return 'bg-warning text-dark';
    return 'bg-info text-dark';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-custom sticky-top py-3">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-4" to="/">
          <span className="p-2 bg-primary rounded-3 text-white d-inline-flex align-items-center justify-content-center shadow-sm">
            <i className="bi bi-journal-bookmark-fill fs-5"></i>
          </span>
          <span className="text-white">Library <span className="text-primary">Portal</span></span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
          aria-controls="navbarMain"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarMain">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 gap-1">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/')}`} to="/">
                <i className="bi bi-house me-1"></i> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/books')}`} to="/books">
                <i className="bi bi-book me-1"></i> Books Directory
              </Link>
            </li>

            {isAuthenticated && (
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/dashboard')}`} to="/dashboard">
                  <i className="bi bi-speedometer2 me-1"></i> Dashboard
                </Link>
              </li>
            )}

            {isStaff && (
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/loans')}`} to="/loans">
                    <i className="bi bi-arrow-left-right me-1"></i> Loan Management
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/members')}`} to="/members">
                    <i className="bi bi-people me-1"></i> Members
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/books/new')}`} to="/books/new">
                    <i className="bi bi-plus-circle me-1"></i> Add Book
                  </Link>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="position-relative">
                  <button
                    className="btn btn-outline-light border-0 position-relative p-2"
                    type="button"
                    onClick={() => setShowNotifs(!showNotifs)}
                    title="Notifications"
                  >
                    <i className="bi bi-bell fs-5"></i>
                    {unreadCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifs && (
                    <div
                      className="card position-absolute end-0 mt-2 shadow-lg p-0"
                      style={{ width: '320px', zIndex: 1050 }}
                    >
                      <div className="card-header bg-white d-flex justify-content-between align-items-center py-2">
                        <span className="fw-bold small">Notifications</span>
                        <span className="badge bg-secondary">{notifications.length}</span>
                      </div>
                      <div className="list-group list-group-flush" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                        {notifications.length === 0 ? (
                          <div className="p-3 text-center text-muted small">No notifications yet</div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n._id}
                              className={`list-group-item list-group-item-action p-2 small ${
                                !n.isRead ? 'bg-light fw-semibold' : ''
                              }`}
                              onClick={() => handleMarkAsRead(n._id)}
                              style={{ cursor: 'pointer' }}
                            >
                              <div className="d-flex justify-content-between">
                                <span className="text-primary">{n.title}</span>
                                {!n.isRead && <span className="badge bg-primary">New</span>}
                              </div>
                              <div className="text-muted mt-1">{n.message}</div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="d-flex align-items-center gap-2">
                  <Link
                    to="/profile"
                    className="text-decoration-none text-light d-flex align-items-center gap-2 bg-dark px-3 py-1 rounded-pill border border-secondary"
                  >
                    <i className="bi bi-person-circle fs-5 text-primary"></i>
                    <span className="small fw-semibold">{user.name}</span>
                    <span className={`badge ${getRoleBadgeClass(user.role)} small`}>
                      {user.role}
                    </span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="btn btn-outline-danger btn-sm rounded-pill px-3"
                    title="Logout"
                  >
                    <i className="bi bi-box-arrow-right me-1"></i> Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-outline-light btn-sm px-3 rounded-pill">
                  <i className="bi bi-box-arrow-in-right me-1"></i> Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm px-3 rounded-pill">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
```

---

## 34. `client/src/components/Footer.jsx`
```javascript
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-top py-4 mt-auto">
      <div className="container">
        <div className="row align-items-center justify-content-between gy-3">
          <div className="col-md-6 text-center text-md-start">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-1">
              <i className="bi bi-journal-bookmark-fill text-primary"></i>
              <span className="fw-bold text-dark">Library Portal</span>
              <span className="badge bg-light text-secondary border">MERN Stack</span>
            </div>
            <p className="text-muted small mb-0">
              Modern Knowledge, Book Lending & Inventory Management System.
            </p>
          </div>

          <div className="col-md-6 text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end gap-3 small text-muted">
              <Link to="/books" className="text-decoration-none text-muted">Catalog</Link>
              <span>•</span>
              <Link to="/login" className="text-decoration-none text-muted">Portal Login</Link>
              <span>•</span>
              <span className="text-success"><i className="bi bi-shield-check me-1"></i>System Active</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
```

---

## 35. `client/src/components/ProtectedRoute.jsx`
```javascript
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
```

---

## 36. `client/src/components/StatCard.jsx`
```javascript
import React from 'react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon, color = 'primary', linkText, to }) => {
  return (
    <div className="card stat-card shadow-sm h-100 border-0">
      <div className="card-body p-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <span className="text-muted fw-semibold small text-uppercase tracking-wider">{title}</span>
          <div className={`stat-icon bg-${color}-subtle text-${color}`}>
            <i className={`bi ${icon}`}></i>
          </div>
        </div>
        <h2 className="display-6 fw-bold mb-0 text-dark">{value}</h2>

        {to && (
          <div className="mt-3 pt-2 border-top">
            <Link to={to} className={`text-${color} text-decoration-none small fw-semibold d-inline-flex align-items-center gap-1`}>
              {linkText || 'View details'} <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
```

---

## 37. `client/src/pages/Home.jsx`
```javascript
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedBooks();
  }, []);

  const fetchFeaturedBooks = async () => {
    try {
      const { data } = await api.get('/books?sort=available');
      setFeaturedBooks(data.books.slice(0, 4));
    } catch (e) {
      console.error('Error fetching featured books:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/books');
    }
  };

  return (
    <div>
      <section className="bg-white border-bottom py-5">
        <div className="container py-4">
          <div className="row align-items-center gy-5">
            <div className="col-lg-7">
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill mb-3">
                <i className="bi bi-stars me-1"></i> Modern MERN Library Management
              </span>
              <h1 className="display-4 fw-extrabold text-dark mb-3">
                Discover Knowledge with <span className="text-primary">Library Portal</span>
              </h1>
              <p className="lead text-muted mb-4">
                A streamlined portal for book discovery, fast debounced search, inventory management,
                and real-time book lending for Members, Librarians, and Administrators.
              </p>

              <form onSubmit={handleHeroSearch} className="mb-4">
                <div className="input-group input-group-lg shadow-sm rounded-4 overflow-hidden border">
                  <span className="input-group-text bg-white border-0 ps-3">
                    <i className="bi bi-search text-muted"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-0 px-2"
                    placeholder="Search by Title, Author, or ISBN..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary px-4 fw-semibold">
                    Explore Books
                  </button>
                </div>
              </form>

              <div className="d-flex flex-wrap gap-3">
                <Link to="/books" className="btn btn-outline-dark rounded-pill px-4">
                  <i className="bi bi-grid me-2"></i>View Full Catalog
                </Link>
                <Link to="/login" className="btn btn-light border rounded-pill px-4">
                  <i className="bi bi-shield-lock me-2"></i>Portal Login
                </Link>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="position-relative text-center">
                <img
                  src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&auto=format&fit=crop&q=80"
                  alt="Library Hall"
                  className="img-fluid rounded-4 shadow-lg"
                  style={{ maxHeight: '380px', width: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="card border-0 p-4 shadow-sm h-100">
                <div className="mx-auto mb-3 stat-icon bg-primary-subtle text-primary">
                  <i className="bi bi-search"></i>
                </div>
                <h5 className="fw-bold">Debounced Search</h5>
                <p className="text-muted small mb-0">
                  Instant, high-performance searching across titles, authors, and ISBNs with category pill filters.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 p-4 shadow-sm h-100">
                <div className="mx-auto mb-3 stat-icon bg-success-subtle text-success">
                  <i className="bi bi-arrow-repeat"></i>
                </div>
                <h5 className="fw-bold">Loan Lifecycle</h5>
                <p className="text-muted small mb-0">
                  Simple 1-click book issuing, overdue tracking, automatic copy stock updating, and member notifications.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 p-4 shadow-sm h-100">
                <div className="mx-auto mb-3 stat-icon bg-purple-subtle text-danger">
                  <i className="bi bi-people"></i>
                </div>
                <h5 className="fw-bold">Role-Based Access</h5>
                <p className="text-muted small mb-0">
                  Dedicated privileges for Members (borrowing & profile), Librarians (inventory & issuing), and Admins.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <span className="text-primary fw-semibold small text-uppercase">Top Picks</span>
              <h2 className="fw-bold mb-0">Available in the Library</h2>
            </div>
            <Link to="/books" className="text-decoration-none fw-semibold">
              See all books <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <div className="row g-4">
              {featuredBooks.map((book) => (
                <div key={book._id} className="col-md-6 col-lg-3">
                  <div className="card book-card h-100 shadow-sm border-0">
                    <img
                      src={book.coverImage}
                      className="card-img-top"
                      alt={book.title}
                    />
                    <div className="card-body d-flex flex-column justify-content-between p-3">
                      <div>
                        <span className="badge bg-light text-primary border mb-2">{book.category}</span>
                        <h6 className="card-title fw-bold mb-1 text-truncate" title={book.title}>
                          {book.title}
                        </h6>
                        <p className="card-text text-muted small mb-2">By {book.author}</p>
                      </div>

                      <div className="pt-2 border-top d-flex justify-content-between align-items-center">
                        <span className={`badge ${book.availableCopies > 0 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                          {book.availableCopies > 0 ? `${book.availableCopies} available` : 'Borrowed Out'}
                        </span>
                        <Link to={`/books/${book._id}`} className="btn btn-sm btn-outline-primary rounded-pill">
                          Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
```

---

## 38. `client/src/pages/Login.jsx`
```javascript
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (role) => {
    if (role === 'admin') {
      setEmail('admin@library.com');
      setPassword('admin123');
    } else if (role === 'librarian') {
      setEmail('librarian@library.com');
      setPassword('librarian123');
    } else if (role === 'member') {
      setEmail('member@library.com');
      setPassword('member123');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-5">
          <div className="card shadow-sm border-0 p-4">
            <div className="text-center mb-4">
              <div className="d-inline-flex p-3 bg-primary-subtle text-primary rounded-circle mb-2">
                <i className="bi bi-shield-lock-fill fs-3"></i>
              </div>
              <h3 className="fw-bold text-dark">Portal Login</h3>
              <p className="text-muted small">Access your Library Portal dashboard</p>
            </div>

            <div className="bg-light p-3 rounded-3 mb-4 border">
              <span className="small fw-bold text-secondary d-block mb-2">
                <i className="bi bi-lightning-charge-fill text-warning me-1"></i> Quick Demo Logins:
              </span>
              <div className="d-flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setDemoCredentials('admin')}
                  className="btn btn-outline-danger btn-sm quick-login-btn"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => setDemoCredentials('librarian')}
                  className="btn btn-outline-warning text-dark btn-sm quick-login-btn"
                >
                  Librarian
                </button>
                <button
                  type="button"
                  onClick={() => setDemoCredentials('member')}
                  className="btn btn-outline-primary btn-sm quick-login-btn"
                >
                  Member
                </button>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger py-2 small d-flex align-items-center gap-2" role="alert">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <div>{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-white text-muted">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="name@library.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-white text-muted">
                    <i className="bi bi-key"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-semibold rounded-3 mb-3"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Sign In'}
              </button>
            </form>

            <div className="text-center mt-3 pt-3 border-top">
              <span className="text-muted small">Don't have an account? </span>
              <Link to="/register" className="small fw-bold text-decoration-none">
                Register as Member
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
```

---

## 39. `client/src/pages/Register.jsx`
```javascript
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    role: 'Member',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters long');
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        role: formData.role,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm border-0 p-4">
            <div className="text-center mb-4">
              <div className="d-inline-flex p-3 bg-success-subtle text-success rounded-circle mb-2">
                <i className="bi bi-person-plus-fill fs-3"></i>
              </div>
              <h3 className="fw-bold text-dark">Join Library Portal</h3>
              <p className="text-muted small">Create your library membership account</p>
            </div>

            {error && (
              <div className="alert alert-danger py-2 small d-flex align-items-center gap-2" role="alert">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <div>{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label small fw-semibold">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    placeholder="Re-type password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Account Role</label>
                  <select
                    name="role"
                    className="form-select"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="Member">Member (Student / Reader)</option>
                    <option value="Librarian">Librarian (Staff)</option>
                    <option value="Admin">Administrator</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Address / Dept</label>
                  <input
                    type="text"
                    name="address"
                    className="form-control"
                    placeholder="e.g. Campus Hostel A"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-semibold rounded-3 mt-4 mb-2"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="text-center mt-3 pt-3 border-top">
              <span className="text-muted small">Already have an account? </span>
              <Link to="/login" className="small fw-bold text-decoration-none">
                Log In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
```

---

## 40. `client/src/pages/Dashboard.jsx`
```javascript
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StatCard from '../components/StatCard';

const Dashboard = () => {
  const { user, isStaff, isMember } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard');
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async (loanId) => {
    try {
      const res = await api.put(`/loans/${loanId}/return`);
      setActionSuccess(res.data.message || 'Book returned successfully!');
      fetchDashboardData();
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to return book');
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  const { stats } = data || {};

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold mb-1">
            Welcome back, {user?.name}! <span className="badge bg-primary-subtle text-primary fs-6">{user?.role}</span>
          </h2>
          <p className="text-muted small mb-0">
            {isStaff
              ? 'Library Operations Overview & Real-time Management'
              : `Member Code: ${user?.memberCode || 'Active Reader'} • Your Personal Bookshelf`}
          </p>
        </div>

        {isStaff && (
          <div className="d-flex gap-2 mt-3 mt-md-0">
            <Link to="/books/new" className="btn btn-primary btn-sm rounded-pill px-3 shadow-sm">
              <i className="bi bi-plus-lg me-1"></i> Add Book
            </Link>
            <Link to="/loans" className="btn btn-outline-primary btn-sm rounded-pill px-3">
              <i className="bi bi-arrow-left-right me-1"></i> Issue / Return
            </Link>
          </div>
        )}
      </div>

      {actionSuccess && (
        <div className="alert alert-success alert-dismissible fade show small" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          {actionSuccess}
          <button type="button" className="btn-close" onClick={() => setActionSuccess('')}></button>
        </div>
      )}

      {isStaff && stats && (
        <>
          <div className="row g-3 mb-4">
            <div className="col-sm-6 col-lg-3">
              <StatCard
                title="Total Titles"
                value={stats.totalBooks}
                icon="bi-journal-bookmark"
                color="primary"
                linkText="View catalog"
                to="/books"
              />
            </div>
            <div className="col-sm-6 col-lg-3">
              <StatCard
                title="Available Copies"
                value={stats.availableCopies}
                icon="bi-check2-circle"
                color="success"
                linkText="Check stock"
                to="/books"
              />
            </div>
            <div className="col-sm-6 col-lg-3">
              <StatCard
                title="Active Loans"
                value={stats.activeLoans}
                icon="bi-arrow-left-right"
                color="info"
                linkText="Manage loans"
                to="/loans"
              />
            </div>
            <div className="col-sm-6 col-lg-3">
              <StatCard
                title="Overdue Books"
                value={stats.overdueLoans}
                icon="bi-exclamation-triangle"
                color="danger"
                linkText="View overdue"
                to="/loans?status=overdue"
              />
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-8">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                  <h6 className="fw-bold mb-0">Recent Lending Transactions</h6>
                  <Link to="/loans" className="btn btn-sm btn-link text-decoration-none">
                    View All
                  </Link>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light small">
                      <tr>
                        <th>Book</th>
                        <th>Member</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody className="small">
                      {data.recentLoans?.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center py-4 text-muted">
                            No loan activity found
                          </td>
                        </tr>
                      ) : (
                        data.recentLoans.map((loan) => (
                          <tr key={loan._id}>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <img
                                  src={loan.book?.coverImage || 'https://via.placeholder.com/40x55'}
                                  alt="cover"
                                  className="rounded"
                                  style={{ width: '32px', height: '42px', objectFit: 'cover' }}
                                />
                                <div className="fw-semibold text-truncate" style={{ maxWidth: '200px' }}>
                                  {loan.book?.title || 'Unknown Book'}
                                </div>
                              </div>
                            </td>
                            <td>
                              <div>{loan.member?.name || 'Unknown Member'}</div>
                              <span className="text-muted smaller">{loan.member?.memberCode}</span>
                            </td>
                            <td>{new Date(loan.dueDate).toLocaleDateString()}</td>
                            <td>
                              <span
                                className={`badge ${
                                  loan.status === 'returned'
                                    ? 'bg-success'
                                    : loan.status === 'overdue'
                                    ? 'bg-danger'
                                    : 'bg-primary'
                                }`}
                              >
                                {loan.status}
                              </span>
                            </td>
                            <td>
                              {loan.status !== 'returned' && (
                                <button
                                  onClick={() => handleReturnBook(loan._id)}
                                  className="btn btn-outline-success btn-sm py-0 px-2"
                                >
                                  Return
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                  <h6 className="fw-bold mb-0">Recently Added Books</h6>
                  <Link to="/books" className="btn btn-sm btn-link text-decoration-none">
                    Catalog
                  </Link>
                </div>
                <div className="list-group list-group-flush">
                  {data.recentBooks?.map((b) => (
                    <div key={b._id} className="list-group-item d-flex align-items-center gap-3 py-2">
                      <img
                        src={b.coverImage}
                        alt="cover"
                        className="rounded shadow-sm"
                        style={{ width: '38px', height: '52px', objectFit: 'cover' }}
                      />
                      <div className="flex-grow-1 overflow-hidden">
                        <Link to={`/books/${b._id}`} className="fw-semibold text-dark text-decoration-none text-truncate d-block small">
                          {b.title}
                        </Link>
                        <div className="text-muted smaller">{b.author}</div>
                        <span className="badge bg-light text-secondary border smaller">
                          {b.availableCopies} left
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {isMember && (
        <>
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <StatCard
                title="Active Borrowed Books"
                value={stats?.activeCount || 0}
                icon="bi-book-half"
                color="primary"
              />
            </div>
            <div className="col-md-4">
              <StatCard
                title="Overdue Notices"
                value={stats?.overdueCount || 0}
                icon="bi-alarm"
                color={stats?.overdueCount > 0 ? 'danger' : 'secondary'}
              />
            </div>
            <div className="col-md-4">
              <StatCard
                title="Total Borrowing History"
                value={stats?.totalBorrowed || 0}
                icon="bi-clock-history"
                color="success"
              />
            </div>
          </div>

          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0">Currently In Your Possession</h5>
              <Link to="/books" className="btn btn-outline-primary btn-sm rounded-pill">
                <i className="bi bi-search me-1"></i> Borrow Another Book
              </Link>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light small">
                  <tr>
                    <th>Book</th>
                    <th>Category</th>
                    <th>Issue Date</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody className="small">
                  {data.activeLoans?.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-5 text-muted">
                        <i className="bi bi-emoji-smile fs-1 d-block mb-2 text-primary"></i>
                        You currently have no borrowed books. Check out our catalog!
                      </td>
                    </tr>
                  ) : (
                    data.activeLoans.map((loan) => {
                      const isPastDue = new Date(loan.dueDate) < new Date();
                      return (
                        <tr key={loan._id}>
                          <td>
                            <div className="d-flex align-items-center gap-3">
                              <img
                                src={loan.book?.coverImage}
                                alt="cover"
                                className="rounded shadow-sm"
                                style={{ width: '40px', height: '56px', objectFit: 'cover' }}
                              />
                              <div>
                                <Link to={`/books/${loan.book?._id}`} className="fw-bold text-dark text-decoration-none">
                                  {loan.book?.title}
                                </Link>
                                <div className="text-muted smaller">By {loan.book?.author}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark border">{loan.book?.category}</span>
                          </td>
                          <td>{new Date(loan.issueDate).toLocaleDateString()}</td>
                          <td className={isPastDue ? 'text-danger fw-bold' : ''}>
                            {new Date(loan.dueDate).toLocaleDateString()}
                            {isPastDue && <span className="badge bg-danger ms-2">Overdue</span>}
                          </td>
                          <td>
                            <span className={`badge ${isPastDue ? 'bg-danger' : 'bg-primary'}`}>
                              {isPastDue ? 'Overdue' : 'Borrowed'}
                            </span>
                          </td>
                          <td>
                            <button
                              onClick={() => handleReturnBook(loan._id)}
                              className="btn btn-success btn-sm rounded-pill px-3"
                            >
                              <i className="bi bi-box-arrow-in-down me-1"></i> Return Book
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
```

---

## 41. `client/src/pages/BooksList.jsx`
```javascript
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import useDebounce from '../hooks/useDebounce';
import { useAuth } from '../context/AuthContext';

const BooksList = () => {
  const { isStaff, isAdmin, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [sortOption, setSortOption] = useState('newest');

  // Debounced search term (400ms delay)
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/books/categories');
      setCategories(data);
    } catch (e) {
      console.error('Failed to load categories:', e);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [debouncedSearchTerm, selectedCategory, sortOption]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError('');

      let url = `/books?sort=${sortOption}`;
      if (debouncedSearchTerm.trim()) {
        url += `&search=${encodeURIComponent(debouncedSearchTerm.trim())}`;
      }
      if (selectedCategory && selectedCategory !== 'All') {
        url += `&category=${encodeURIComponent(selectedCategory)}`;
      }

      const { data } = await api.get(url);
      setBooks(data.books || []);
    } catch (err) {
      setError('Failed to fetch books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickBorrow = async (bookId) => {
    if (!isAuthenticated) {
      alert('Please log in to borrow books.');
      return;
    }
    try {
      await api.post('/loans', { bookId });
      setFeedbackMsg('Book borrowed successfully! Check your Dashboard.');
      fetchBooks();
      setTimeout(() => setFeedbackMsg(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to borrow book');
    }
  };

  const handleDeleteBook = async (bookId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await api.delete(`/books/${bookId}`);
      setFeedbackMsg(`"${title}" deleted successfully.`);
      fetchBooks();
      setTimeout(() => setFeedbackMsg(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete book');
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1 text-dark">
            <i className="bi bi-journals text-primary me-2"></i>Library Catalog Directory
          </h2>
          <p className="text-muted small mb-0">
            Browse, search in real-time, and filter our extensive collection of titles.
          </p>
        </div>

        {isStaff && (
          <Link to="/books/new" className="btn btn-primary rounded-pill px-4 shadow-sm">
            <i className="bi bi-plus-lg me-1"></i> Add New Book
          </Link>
        )}
      </div>

      {feedbackMsg && (
        <div className="alert alert-success alert-dismissible fade show small" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          {feedbackMsg}
          <button type="button" className="btn-close" onClick={() => setFeedbackMsg('')}></button>
        </div>
      )}

      <div className="card shadow-sm border-0 p-3 mb-4 bg-white">
        <div className="row g-3 align-items-center">
          <div className="col-md-6 col-lg-7">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control bg-light border-start-0 ps-0"
                placeholder="Debounced Search: Type Title, Author, or ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="btn btn-light border"
                  type="button"
                  onClick={() => setSearchTerm('')}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              )}
            </div>
          </div>

          <div className="col-md-6 col-lg-5 d-flex gap-2 justify-content-md-end">
            <select
              className="form-select w-auto"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="newest">Sort: Recently Added</option>
              <option value="title_asc">Title (A - Z)</option>
              <option value="title_desc">Title (Z - A)</option>
              <option value="available">Availability</option>
            </select>
          </div>
        </div>

        <div className="mt-3 pt-3 border-top">
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span className="small fw-semibold text-muted me-1">
              <i className="bi bi-funnel me-1"></i>Category:
            </span>
            <button
              type="button"
              className={`btn btn-sm ${
                selectedCategory === 'All' ? 'btn-primary' : 'btn-outline-secondary'
              } category-pill`}
              onClick={() => setSelectedCategory('All')}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`btn btn-sm ${
                  selectedCategory === cat ? 'btn-primary' : 'btn-outline-secondary'
                } category-pill`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3 text-muted small">
        <span>
          Showing <strong>{books.length}</strong> {books.length === 1 ? 'book' : 'books'}
        </span>
        {loading && (
          <span className="d-inline-flex align-items-center text-primary">
            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
            Filtering...
          </span>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
        {books.map((book) => {
          const isAvailable = book.availableCopies > 0;
          return (
            <div key={book._id} className="col-sm-6 col-md-4 col-lg-3">
              <div className="card book-card h-100 shadow-sm border-0 position-relative">
                <span
                  className="position-absolute top-0 end-0 m-2 badge bg-dark bg-opacity-75 text-white"
                  style={{ zIndex: 2 }}
                >
                  {book.category}
                </span>

                <img
                  src={book.coverImage}
                  className="card-img-top"
                  alt={book.title}
                  loading="lazy"
                />

                <div className="card-body p-3 d-flex flex-column justify-content-between">
                  <div>
                    <h6 className="card-title fw-bold text-dark mb-1 text-truncate" title={book.title}>
                      {book.title}
                    </h6>
                    <p className="card-text text-muted small mb-2">By {book.author}</p>
                    <div className="smaller text-secondary mb-2" style={{ fontSize: '0.78rem' }}>
                      <i className="bi bi-upc me-1"></i>ISBN: {book.isbn}
                    </div>
                  </div>

                  <div className="pt-2 border-top">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span
                        className={`badge ${
                          isAvailable
                            ? 'bg-success-subtle text-success border border-success-subtle'
                            : 'bg-danger-subtle text-danger border border-danger-subtle'
                        }`}
                      >
                        {isAvailable ? `${book.availableCopies} available` : 'Out of Stock'}
                      </span>
                      <span className="text-muted smaller" style={{ fontSize: '0.78rem' }}>
                        Total: {book.totalCopies}
                      </span>
                    </div>

                    <div className="d-flex gap-1">
                      <Link
                        to={`/books/${book._id}`}
                        className="btn btn-outline-primary btn-sm flex-grow-1 rounded-pill"
                      >
                        Details
                      </Link>

                      {isAvailable && (
                        <button
                          onClick={() => handleQuickBorrow(book._id)}
                          className="btn btn-primary btn-sm rounded-pill px-3"
                        >
                          Borrow
                        </button>
                      )}

                      {isStaff && (
                        <Link
                          to={`/books/${book._id}/edit`}
                          className="btn btn-outline-secondary btn-sm rounded-circle p-1 px-2"
                        >
                          <i className="bi bi-pencil"></i>
                        </Link>
                      )}

                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteBook(book._id, book.title)}
                          className="btn btn-outline-danger btn-sm rounded-circle p-1 px-2"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BooksList;
```

---

## 42. `client/src/pages/BookDetails.jsx`
```javascript
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isStaff, isAdmin } = useAuth();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [borrowLoading, setBorrowLoading] = useState(false);

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/books/${id}`);
      setBook(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load book details');
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setBorrowLoading(true);
      await api.post('/loans', { bookId: id });
      setSuccessMsg('Book issued to your account successfully! You can view it on your Dashboard.');
      fetchBookDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not borrow book');
    } finally {
      setBorrowLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this book from the catalog?')) return;
    try {
      await api.delete(`/books/${id}`);
      navigate('/books');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete book');
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (error && !book) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
        <Link to="/books" className="btn btn-outline-primary">Back to Catalog</Link>
      </div>
    );
  }

  const isAvailable = book.availableCopies > 0;

  return (
    <div className="container py-5">
      <Link to="/books" className="text-decoration-none text-muted small d-inline-flex align-items-center gap-1 mb-4">
        <i className="bi bi-arrow-left"></i> Back to Books Directory
      </Link>

      {successMsg && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          {successMsg}
          <button type="button" className="btn-close" onClick={() => setSuccessMsg('')}></button>
        </div>
      )}

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      <div className="card shadow-sm border-0 p-4">
        <div className="row g-4 align-items-start">
          <div className="col-md-4 text-center">
            <img
              src={book.coverImage}
              alt={book.title}
              className="img-fluid rounded-3 shadow"
              style={{ maxHeight: '420px', width: '100%', objectFit: 'cover' }}
            />
          </div>

          <div className="col-md-8">
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                {book.category}
              </span>
              <span
                className={`badge ${
                  isAvailable
                    ? 'bg-success-subtle text-success border border-success-subtle'
                    : 'bg-danger-subtle text-danger border border-danger-subtle'
                }`}
              >
                {isAvailable ? `${book.availableCopies} Available for Checkout` : 'Currently Out of Stock'}
              </span>
            </div>

            <h2 className="fw-bold text-dark mb-1">{book.title}</h2>
            <p className="lead text-muted mb-4">By <span className="text-dark fw-semibold">{book.author}</span></p>

            <div className="bg-light p-3 rounded-3 mb-4 border">
              <div className="row g-3 small">
                <div className="col-sm-6">
                  <span className="text-muted d-block">ISBN</span>
                  <span className="fw-bold">{book.isbn}</span>
                </div>
                <div className="col-sm-6">
                  <span className="text-muted d-block">Published Year</span>
                  <span className="fw-bold">{book.publishedYear}</span>
                </div>
                <div className="col-sm-6">
                  <span className="text-muted d-block">Publisher</span>
                  <span className="fw-bold">{book.publisher || 'Not Specified'}</span>
                </div>
                <div className="col-sm-6">
                  <span className="text-muted d-block">Inventory Stock</span>
                  <span className="fw-bold">{book.availableCopies} / {book.totalCopies} Copies</span>
                </div>
              </div>
            </div>

            <h6 className="fw-bold text-dark mb-2">Synopsis & Description</h6>
            <p className="text-secondary mb-4" style={{ lineHeight: '1.7' }}>
              {book.description || 'No detailed description available for this book.'}
            </p>

            <div className="d-flex flex-wrap gap-2 pt-3 border-top">
              {isAvailable ? (
                <button
                  onClick={handleBorrow}
                  disabled={borrowLoading}
                  className="btn btn-primary rounded-pill px-4 py-2 fw-semibold"
                >
                  {borrowLoading ? 'Borrowing...' : 'Borrow This Book'}
                </button>
              ) : (
                <button className="btn btn-secondary rounded-pill px-4 py-2" disabled>
                  No Copies Available
                </button>
              )}

              {isStaff && (
                <>
                  <Link
                    to={`/loans?bookId=${book._id}`}
                    className="btn btn-outline-info rounded-pill px-4 py-2"
                  >
                    Issue to Member
                  </Link>

                  <Link
                    to={`/books/${book._id}/edit`}
                    className="btn btn-outline-secondary rounded-pill px-4 py-2"
                  >
                    Edit Book
                  </Link>
                </>
              )}

              {isAdmin && (
                <button
                  onClick={handleDelete}
                  className="btn btn-outline-danger rounded-pill px-4 py-2 ms-auto"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
```

---

## 43. `client/src/pages/BookForm.jsx`
```javascript
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const BookForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'Computer Science',
    totalCopies: 5,
    availableCopies: 5,
    description: '',
    publisher: '',
    publishedYear: new Date().getFullYear(),
    coverImage: '',
  });

  const [categories, setCategories] = useState([
    'Computer Science',
    'Literature & Fiction',
    'Science & History',
    'Self Help & Business',
    'Philosophy',
    'Art & Design',
  ]);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      loadBook();
    }
    loadCategories();
  }, [id]);

  const loadCategories = async () => {
    try {
      const { data } = await api.get('/books/categories');
      if (data && data.length > 0) {
        setCategories((prev) => Array.from(new Set([...prev, ...data])));
      }
    } catch (e) {}
  };

  const loadBook = async () => {
    try {
      setFetching(true);
      const { data } = await api.get(`/books/${id}`);
      setFormData({
        title: data.title || '',
        author: data.author || '',
        isbn: data.isbn || '',
        category: data.category || 'Computer Science',
        totalCopies: data.totalCopies || 1,
        availableCopies: data.availableCopies || 1,
        description: data.description || '',
        publisher: data.publisher || '',
        publishedYear: data.publishedYear || new Date().getFullYear(),
        coverImage: data.coverImage || '',
      });
    } catch (err) {
      setError('Failed to load book data for editing');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (!isEditing && name === 'totalCopies') {
        updated.availableCopies = value;
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEditing) {
        await api.put(`/books/${id}`, formData);
        navigate(`/books/${id}`);
      } else {
        const { data } = await api.post('/books', formData);
        navigate(`/books/${data._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving book');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 p-4">
            <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
              <div>
                <h3 className="fw-bold mb-1">
                  {isEditing ? 'Edit Book Details' : 'Add New Book to Catalog'}
                </h3>
                <p className="text-muted small mb-0">
                  {isEditing
                    ? 'Update metadata and stock information'
                    : 'Fill in the book details to index it into the library directory'}
                </p>
              </div>
              <Link to="/books" className="btn btn-outline-secondary btn-sm rounded-pill">
                Cancel
              </Link>
            </div>

            {error && (
              <div className="alert alert-danger py-2 small d-flex align-items-center gap-2" role="alert">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <div>{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label small fw-semibold">Book Title *</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    placeholder="e.g. Design Patterns: Elements of Reusable Object-Oriented Software"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Author(s) *</label>
                  <input
                    type="text"
                    name="author"
                    className="form-control"
                    placeholder="e.g. Erich Gamma, Richard Helm"
                    value={formData.author}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">ISBN Identifier *</label>
                  <input
                    type="text"
                    name="isbn"
                    className="form-control"
                    placeholder="e.g. 978-0201633610"
                    value={formData.isbn}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Category / Genre *</label>
                  <select
                    name="category"
                    className="form-select"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label small fw-semibold">Total Copies *</label>
                  <input
                    type="number"
                    name="totalCopies"
                    min="1"
                    className="form-control"
                    value={formData.totalCopies}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label small fw-semibold">Available Copies</label>
                  <input
                    type="number"
                    name="availableCopies"
                    min="0"
                    max={formData.totalCopies}
                    className="form-control"
                    value={formData.availableCopies}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Publisher</label>
                  <input
                    type="text"
                    name="publisher"
                    className="form-control"
                    value={formData.publisher}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Publication Year</label>
                  <input
                    type="number"
                    name="publishedYear"
                    className="form-control"
                    value={formData.publishedYear}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold">Cover Image URL</label>
                  <input
                    type="url"
                    name="coverImage"
                    className="form-control"
                    placeholder="https://images.unsplash.com/... (optional)"
                    value={formData.coverImage}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold">Description / Synopsis</label>
                  <textarea
                    name="description"
                    rows="4"
                    className="form-control"
                    value={formData.description}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>

              <div className="mt-4 pt-3 border-top d-flex justify-content-end gap-2">
                <Link to="/books" className="btn btn-light border px-4">
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary px-4 fw-semibold rounded-3"
                >
                  {loading ? 'Saving...' : isEditing ? 'Update Book' : 'Save to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookForm;
```

---

## 44. `client/src/pages/LoansList.jsx`
```javascript
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const LoansList = () => {
  const { isStaff, isAdmin } = useAuth();
  const [searchParams] = useSearchParams();

  const [loans, setLoans] = useState([]);
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const [showIssueModal, setShowIssueModal] = useState(false);
  const [booksList, setBooksList] = useState([]);
  const [membersList, setMembersList] = useState([]);
  const [issueForm, setIssueForm] = useState({
    bookId: searchParams.get('bookId') || '',
    memberId: '',
    durationDays: 14,
    notes: '',
  });
  const [issueLoading, setIssueLoading] = useState(false);

  useEffect(() => {
    fetchLoans();
  }, [statusFilter]);

  useEffect(() => {
    if (searchParams.get('bookId')) {
      setShowIssueModal(true);
    }
  }, [searchParams]);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const url = statusFilter !== 'All' ? `/loans?status=${statusFilter}` : '/loans';
      const { data } = await api.get(url);
      setLoans(data);
    } catch (err) {
      setFeedback({ type: 'danger', message: 'Failed to load loans' });
    } finally {
      setLoading(false);
    }
  };

  const openIssueModal = async () => {
    try {
      setShowIssueModal(true);
      const [booksRes, membersRes] = await Promise.all([
        api.get('/books'),
        api.get('/members'),
      ]);
      setBooksList(booksRes.data.books.filter((b) => b.availableCopies > 0));
      setMembersList(membersRes.data);
    } catch (e) {}
  };

  const handleIssueSubmit = async (e) => {
    e.preventDefault();
    if (!issueForm.bookId || !issueForm.memberId) {
      alert('Please select both a book and a member.');
      return;
    }

    try {
      setIssueLoading(true);
      await api.post('/loans', issueForm);
      setFeedback({ type: 'success', message: 'Book successfully issued!' });
      setShowIssueModal(false);
      setIssueForm({ bookId: '', memberId: '', durationDays: 14, notes: '' });
      fetchLoans();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to issue book');
    } finally {
      setIssueLoading(false);
    }
  };

  const handleReturnBook = async (loanId) => {
    try {
      const { data } = await api.put(`/loans/${loanId}/return`);
      setFeedback({
        type: 'success',
        message: data.message || 'Book returned successfully!',
      });
      fetchLoans();
    } catch (err) {
      alert(err.response?.data?.message || 'Error processing return');
    }
  };

  const handleDeleteLoan = async (loanId) => {
    if (!window.confirm('Delete this loan record permanently?')) return;
    try {
      await api.delete(`/loans/${loanId}`);
      setFeedback({ type: 'success', message: 'Loan record deleted.' });
      fetchLoans();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete loan');
    }
  };

  const filteredLoans = loans.filter((l) => {
    const q = searchTerm.toLowerCase();
    const title = l.book?.title?.toLowerCase() || '';
    const memberName = l.member?.name?.toLowerCase() || '';
    const memberCode = l.member?.memberCode?.toLowerCase() || '';
    return title.includes(q) || memberName.includes(q) || memberCode.includes(q);
  });

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1 text-dark">
            <i className="bi bi-arrow-left-right text-primary me-2"></i>Loan & Lending Management
          </h2>
          <p className="text-muted small mb-0">
            Track circulation, issue books to members, process returns, and manage overdue records.
          </p>
        </div>

        {isStaff && (
          <button
            onClick={openIssueModal}
            className="btn btn-primary rounded-pill px-4 shadow-sm"
          >
            <i className="bi bi-plus-lg me-1"></i> Issue Book
          </button>
        )}
      </div>

      {feedback.message && (
        <div className={`alert alert-${feedback.type} alert-dismissible fade show small`} role="alert">
          {feedback.message}
          <button type="button" className="btn-close" onClick={() => setFeedback({ type: '', message: '' })}></button>
        </div>
      )}

      <div className="card shadow-sm border-0 p-3 mb-4 bg-white">
        <div className="row g-3 align-items-center">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control bg-light border-start-0 ps-0"
                placeholder="Search by book title or member name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-6 d-flex gap-2 justify-content-md-end">
            {['All', 'borrowed', 'overdue', 'returned'].map((status) => (
              <button
                key={status}
                type="button"
                className={`btn btn-sm text-capitalize ${
                  statusFilter === status ? 'btn-primary' : 'btn-outline-secondary'
                } rounded-pill px-3`}
                onClick={() => setStatusFilter(status)}
              >
                {status === 'borrowed' ? 'Active' : status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light small">
              <tr>
                <th>Book Details</th>
                <th>Member</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Return Date</th>
                <th>Status</th>
                <th>Fine</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="small">
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-5">
                    <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                    Loading loans...
                  </td>
                </tr>
              ) : filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-5 text-muted">
                    No loan records match your criteria
                  </td>
                </tr>
              ) : (
                filteredLoans.map((loan) => {
                  const isOverdue = loan.status === 'overdue';
                  return (
                    <tr key={loan._id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={loan.book?.coverImage || 'https://via.placeholder.com/35x45'}
                            alt="book"
                            className="rounded"
                            style={{ width: '32px', height: '44px', objectFit: 'cover' }}
                          />
                          <div>
                            <div className="fw-semibold text-truncate" style={{ maxWidth: '220px' }}>
                              {loan.book?.title || 'Unknown Title'}
                            </div>
                            <span className="text-muted smaller">ISBN: {loan.book?.isbn}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="fw-semibold">{loan.member?.name}</div>
                        <span className="badge bg-light text-secondary border smaller">
                          {loan.member?.memberCode || loan.member?.email}
                        </span>
                      </td>
                      <td>{new Date(loan.issueDate).toLocaleDateString()}</td>
                      <td className={isOverdue ? 'text-danger fw-bold' : ''}>
                        {new Date(loan.dueDate).toLocaleDateString()}
                      </td>
                      <td>
                        {loan.returnDate
                          ? new Date(loan.returnDate).toLocaleDateString()
                          : <span className="text-muted">—</span>}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            loan.status === 'returned'
                              ? 'bg-success-subtle text-success border border-success-subtle'
                              : loan.status === 'overdue'
                              ? 'bg-danger text-white'
                              : 'bg-primary-subtle text-primary border border-primary-subtle'
                          }`}
                        >
                          {loan.status}
                        </span>
                      </td>
                      <td>
                        {loan.fineAmount > 0 ? (
                          <span className="badge bg-danger">₹{loan.fineAmount}</span>
                        ) : (
                          <span className="text-muted">₹0</span>
                        )}
                      </td>
                      <td className="text-end">
                        <div className="d-inline-flex gap-1">
                          {loan.status !== 'returned' && (
                            <button
                              onClick={() => handleReturnBook(loan._id)}
                              className="btn btn-outline-success btn-sm rounded-pill px-3"
                            >
                              Return
                            </button>
                          )}
                          {isAdmin && (
                            <button
                              onClick={() => handleDeleteLoan(loan._id)}
                              className="btn btn-outline-danger btn-sm rounded-circle p-1 px-2"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showIssueModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Issue Book to Member</h5>
                <button type="button" className="btn-close" onClick={() => setShowIssueModal(false)}></button>
              </div>
              <form onSubmit={handleIssueSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Select Book *</label>
                    <select
                      className="form-select"
                      value={issueForm.bookId}
                      onChange={(e) => setIssueForm({ ...issueForm, bookId: e.target.value })}
                      required
                    >
                      <option value="">-- Choose Available Book --</option>
                      {booksList.map((b) => (
                        <option key={b._id} value={b._id}>
                          {b.title} ({b.availableCopies} available)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Select Member *</label>
                    <select
                      className="form-select"
                      value={issueForm.memberId}
                      onChange={(e) => setIssueForm({ ...issueForm, memberId: e.target.value })}
                      required
                    >
                      <option value="">-- Choose Member --</option>
                      {membersList.map((m) => (
                        <option key={m._id} value={m._id}>
                          {m.name} ({m.memberCode || m.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Duration (Days)</label>
                    <input
                      type="number"
                      min="1"
                      max="90"
                      className="form-control"
                      value={issueForm.durationDays}
                      onChange={(e) => setIssueForm({ ...issueForm, durationDays: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Internal Notes (Optional)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={issueForm.notes}
                      onChange={(e) => setIssueForm({ ...issueForm, notes: e.target.value })}
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-light border" onClick={() => setShowIssueModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={issueLoading} className="btn btn-primary px-4 fw-semibold">
                    {issueLoading ? 'Issuing...' : 'Confirm Checkout'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoansList;
```

---

## 45. `client/src/pages/MembersList.jsx`
```javascript
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const MembersList = () => {
  const { isAdmin } = useAuth();
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Member',
    phone: '',
    address: '',
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, [roleFilter]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const url = roleFilter !== 'All' ? `/members?role=${roleFilter}` : '/members';
      const { data } = await api.get(url);
      setMembers(data);
    } catch (e) {
      setFeedback({ type: 'danger', message: 'Failed to load member directory' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/members', newMember);
      setFeedback({ type: 'success', message: 'New member account created successfully!' });
      setShowAddModal(false);
      setNewMember({ name: '', email: '', password: '', role: 'Member', phone: '', address: '' });
      fetchMembers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create member');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/members/${editingMember._id}`, editingMember);
      setFeedback({ type: 'success', message: 'Member details updated successfully!' });
      setShowEditModal(false);
      setEditingMember(null);
      fetchMembers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update member');
    }
  };

  const handleDeleteMember = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name}?`)) return;
    try {
      await api.delete(`/members/${id}`);
      setFeedback({ type: 'success', message: `Member ${name} removed.` });
      fetchMembers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete member');
    }
  };

  const filteredMembers = members.filter((m) => {
    const q = searchTerm.toLowerCase();
    return (
      m.name?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.memberCode?.toLowerCase().includes(q) ||
      m.phone?.includes(q)
    );
  });

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1 text-dark">
            <i className="bi bi-people-fill text-primary me-2"></i>Member Management
          </h2>
          <p className="text-muted small mb-0">
            Maintain registered patron profiles, assign roles, and review library credentials.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary rounded-pill px-4 shadow-sm"
        >
          <i className="bi bi-person-plus me-1"></i> Add New Member
        </button>
      </div>

      {feedback.message && (
        <div className={`alert alert-${feedback.type} alert-dismissible fade show small`} role="alert">
          {feedback.message}
          <button type="button" className="btn-close" onClick={() => setFeedback({ type: '', message: '' })}></button>
        </div>
      )}

      <div className="card shadow-sm border-0 p-3 mb-4 bg-white">
        <div className="row g-3 align-items-center">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control bg-light border-start-0 ps-0"
                placeholder="Search by name, email, or member code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-6 d-flex gap-2 justify-content-md-end">
            {['All', 'Member', 'Librarian', 'Admin'].map((role) => (
              <button
                key={role}
                type="button"
                className={`btn btn-sm ${
                  roleFilter === role ? 'btn-primary' : 'btn-outline-secondary'
                } rounded-pill px-3`}
                onClick={() => setRoleFilter(role)}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light small">
              <tr>
                <th>Member Info</th>
                <th>Member Code</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined Date</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="small">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                    Loading members...
                  </td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    No members match your search
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member._id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle bg-primary-subtle text-primary fw-bold d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                          {member.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="fw-semibold">{member.name}</div>
                          <div className="text-muted smaller">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {member.memberCode || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <div>{member.phone || 'No phone'}</div>
                      <div className="text-muted smaller">{member.address || 'No address'}</div>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          member.role === 'Admin'
                            ? 'bg-danger'
                            : member.role === 'Librarian'
                            ? 'bg-warning text-dark'
                            : 'bg-info text-dark'
                        }`}
                      >
                        {member.role}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          member.membershipStatus === 'Active'
                            ? 'bg-success-subtle text-success border border-success-subtle'
                            : 'bg-secondary'
                        }`}
                      >
                        {member.membershipStatus || 'Active'}
                      </span>
                    </td>
                    <td>{new Date(member.createdAt).toLocaleDateString()}</td>
                    <td className="text-end">
                      <div className="d-inline-flex gap-1">
                        <button
                          onClick={() => {
                            setEditingMember(member);
                            setShowEditModal(true);
                          }}
                          className="btn btn-outline-secondary btn-sm rounded-circle p-1 px-2"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteMember(member._id, member.name)}
                            className="btn btn-outline-danger btn-sm rounded-circle p-1 px-2"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Register New Member / Staff</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleAddSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newMember.name}
                      onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Email Address *</label>
                    <input
                      type="email"
                      className="form-control"
                      value={newMember.email}
                      onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Initial Password *</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Min 6 characters"
                      value={newMember.password}
                      onChange={(e) => setNewMember({ ...newMember, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Role</label>
                    <select
                      className="form-select"
                      value={newMember.role}
                      onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                    >
                      <option value="Member">Member</option>
                      <option value="Librarian">Librarian</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={newMember.phone}
                      onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newMember.address}
                      onChange={(e) => setNewMember({ ...newMember, address: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light border" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary px-4 fw-semibold">
                    Create Member
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editingMember && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Edit Member: {editingMember.name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingMember.name}
                      onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Role</label>
                    <select
                      className="form-select"
                      value={editingMember.role}
                      onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                    >
                      <option value="Member">Member</option>
                      <option value="Librarian">Librarian</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Membership Status</label>
                    <select
                      className="form-select"
                      value={editingMember.membershipStatus || 'Active'}
                      onChange={(e) => setEditingMember({ ...editingMember, membershipStatus: e.target.value })}
                    >
                      <option value="Active">Active</option>
                      <option value="Suspended">Suspended</option>
                      <option value="Expired">Expired</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={editingMember.phone || ''}
                      onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingMember.address || ''}
                      onChange={(e) => setEditingMember({ ...editingMember, address: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light border" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary px-4 fw-semibold">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersList;
```

---

## 46. `client/src/pages/Profile.jsx`
```javascript
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Profile = () => {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    password: '',
  });

  const [myLoans, setMyLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    fetchProfileAndLoans();
  }, []);

  const fetchProfileAndLoans = async () => {
    try {
      const [profileRes, loansRes] = await Promise.all([
        api.get('/auth/profile'),
        api.get('/loans/my'),
      ]);
      setFormData({
        name: profileRes.data.name || '',
        phone: profileRes.data.phone || '',
        address: profileRes.data.address || '',
        password: '',
      });
      setMyLoans(loansRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: '', message: '' });

    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      };
      if (formData.password) {
        payload.password = formData.password;
      }

      const { data } = await api.put('/auth/profile', payload);
      updateUser(data);
      setFeedback({ type: 'success', message: 'Profile updated successfully!' });
      setFormData((prev) => ({ ...prev, password: '' }));
    } catch (err) {
      setFeedback({
        type: 'danger',
        message: err.response?.data?.message || 'Failed to update profile',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (loanId) => {
    try {
      await api.put(`/loans/${loanId}/return`);
      setFeedback({ type: 'success', message: 'Book returned successfully!' });
      fetchProfileAndLoans();
    } catch (err) {
      alert(err.response?.data?.message || 'Error processing return');
    }
  };

  return (
    <div className="container py-4">
      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card shadow-sm border-0 p-4 mb-4">
            <div className="text-center mb-4">
              <div className="d-inline-flex p-3 bg-primary-subtle text-primary rounded-circle mb-2" style={{ width: '70px', height: '70px' }}>
                <span className="fs-2 fw-bold m-auto">{user?.name?.charAt(0).toUpperCase()}</span>
              </div>
              <h4 className="fw-bold mb-1">{user?.name}</h4>
              <p className="text-muted small mb-2">{user?.email}</p>
              <div className="d-flex justify-content-center gap-2">
                <span className="badge bg-primary">{user?.role}</span>
                {user?.memberCode && (
                  <span className="badge bg-light text-dark border">
                    {user?.memberCode}
                  </span>
                )}
              </div>
            </div>

            {feedback.message && (
              <div className={`alert alert-${feedback.type} alert-dismissible fade show small`} role="alert">
                {feedback.message}
                <button type="button" className="btn-close" onClick={() => setFeedback({ type: '', message: '' })}></button>
              </div>
            )}

            <form onSubmit={handleProfileUpdate}>
              <h6 className="fw-bold text-dark mb-3 border-bottom pb-2">Edit Account Information</h6>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Address / Campus Department</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">New Password (Leave blank to keep current)</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-100 py-2 fw-semibold rounded-3 mt-2"
              >
                {loading ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
              <div>
                <h5 className="fw-bold mb-0">Your Loan History & Circulation</h5>
                <span className="text-muted smaller">Total books borrowed: {myLoans.length}</span>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light small">
                  <tr>
                    <th>Book</th>
                    <th>Borrowed On</th>
                    <th>Due On</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody className="small">
                  {myLoans.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-5 text-muted">
                        No loans recorded for this account.
                      </td>
                    </tr>
                  ) : (
                    myLoans.map((loan) => (
                      <tr key={loan._id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <img
                              src={loan.book?.coverImage || 'https://via.placeholder.com/35x45'}
                              alt="cover"
                              className="rounded"
                              style={{ width: '32px', height: '42px', objectFit: 'cover' }}
                            />
                            <div>
                              <div className="fw-semibold text-truncate" style={{ maxWidth: '180px' }}>
                                {loan.book?.title}
                              </div>
                              <span className="text-muted smaller">{loan.book?.category}</span>
                            </div>
                          </div>
                        </td>
                        <td>{new Date(loan.issueDate).toLocaleDateString()}</td>
                        <td>{new Date(loan.dueDate).toLocaleDateString()}</td>
                        <td>
                          <span
                            className={`badge ${
                              loan.status === 'returned'
                                ? 'bg-success-subtle text-success border border-success-subtle'
                                : loan.status === 'overdue'
                                ? 'bg-danger text-white'
                                : 'bg-primary-subtle text-primary border border-primary-subtle'
                            }`}
                          >
                            {loan.status}
                          </span>
                        </td>
                        <td>
                          {loan.status !== 'returned' && (
                            <button
                              onClick={() => handleReturn(loan._id)}
                              className="btn btn-outline-success btn-sm rounded-pill py-0 px-2"
                            >
                              Return
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
```
