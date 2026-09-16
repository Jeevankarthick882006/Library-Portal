// src/pages/BookDetails.jsx - Book Details View
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
          {/* Cover image */}
          <div className="col-md-4 text-center">
            <img
              src={book.coverImage}
              alt={book.title}
              className="img-fluid rounded-3 shadow"
              style={{ maxHeight: '420px', width: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Details */}
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

            {/* Actions */}
            <div className="d-flex flex-wrap gap-2 pt-3 border-top">
              {isAvailable ? (
                <button
                  onClick={handleBorrow}
                  disabled={borrowLoading}
                  className="btn btn-primary rounded-pill px-4 py-2 fw-semibold"
                >
                  {borrowLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Borrowing...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-book me-2"></i> Borrow This Book
                    </>
                  )}
                </button>
              ) : (
                <button className="btn btn-secondary rounded-pill px-4 py-2" disabled>
                  <i className="bi bi-x-circle me-2"></i> No Copies Available
                </button>
              )}

              {isStaff && (
                <>
                  <Link
                    to={`/loans?bookId=${book._id}`}
                    className="btn btn-outline-info rounded-pill px-4 py-2"
                  >
                    <i className="bi bi-person-check me-2"></i> Issue to Member
                  </Link>

                  <Link
                    to={`/books/${book._id}/edit`}
                    className="btn btn-outline-secondary rounded-pill px-4 py-2"
                  >
                    <i className="bi bi-pencil me-2"></i> Edit Book
                  </Link>
                </>
              )}

              {isAdmin && (
                <button
                  onClick={handleDelete}
                  className="btn btn-outline-danger rounded-pill px-4 py-2 ms-auto"
                >
                  <i className="bi bi-trash me-2"></i> Delete
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
