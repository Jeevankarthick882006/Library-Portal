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
