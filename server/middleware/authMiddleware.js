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
