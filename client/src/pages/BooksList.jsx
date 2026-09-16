// src/pages/BooksList.jsx - Book Directory with Debounced Search & Category Filtering
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import useDebounce from '../hooks/useDebounce';
import { useAuth } from '../context/AuthContext';

const BooksList = () => {
  const { isStaff, isAdmin, isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [sortOption, setSortOption] = useState('newest');

  // Debounced search term: waits 400ms after user stops typing before making API query
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  // Data states
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // 1. Fetch distinct categories once on component mount
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

  // 2. Fetch books whenever debouncedSearchTerm, selectedCategory, or sortOption changes
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

  // Handle Quick Borrow for authenticated members
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

  // Handle Delete Book (Admin only)
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
      {/* Header section */}
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

      {/* SEARCH AND FILTER BAR */}
      <div className="card shadow-sm border-0 p-3 mb-4 bg-white">
        <div className="row g-3 align-items-center">
          {/* Debounced Search Input */}
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
                  title="Clear search"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              )}
            </div>
          </div>

          {/* Sort Dropdown */}
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

        {/* Category Filter Pills */}
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

      {/* RESULTS COUNT & STATUS */}
      <div className="d-flex justify-content-between align-items-center mb-3 text-muted small">
        <span>
          Showing <strong>{books.length}</strong> {books.length === 1 ? 'book' : 'books'}
          {selectedCategory !== 'All' && ` in "${selectedCategory}"`}
          {debouncedSearchTerm && ` matching "${debouncedSearchTerm}"`}
        </span>
        {loading && (
          <span className="d-inline-flex align-items-center text-primary">
            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
            Filtering...
          </span>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* BOOKS GRID */}
      {books.length === 0 && !loading ? (
        <div className="card border-0 shadow-sm p-5 text-center">
          <div className="text-muted mb-3">
            <i className="bi bi-inbox fs-1"></i>
          </div>
          <h5 className="fw-bold">No books found</h5>
          <p className="text-muted small">
            Try adjusting your search keywords or switching category filters.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}
            className="btn btn-outline-primary btn-sm mx-auto rounded-pill px-3"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {books.map((book) => {
            const isAvailable = book.availableCopies > 0;
            return (
              <div key={book._id} className="col-sm-6 col-md-4 col-lg-3">
                <div className="card book-card h-100 shadow-sm border-0 position-relative">
                  {/* Category Pill Tag */}
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

                      {/* Action Buttons */}
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
                            title="Borrow this book"
                          >
                            Borrow
                          </button>
                        )}

                        {isStaff && (
                          <Link
                            to={`/books/${book._id}/edit`}
                            className="btn btn-outline-secondary btn-sm rounded-circle p-1 px-2"
                            title="Edit book"
                          >
                            <i className="bi bi-pencil"></i>
                          </Link>
                        )}

                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteBook(book._id, book.title)}
                            className="btn btn-outline-danger btn-sm rounded-circle p-1 px-2"
                            title="Delete book"
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
      )}
    </div>
  );
};

export default BooksList;
