// src/pages/BookForm.jsx - Add / Edit Book Form (Staff: Librarian, Admin)
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

  // If editing, load current book data
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
    } catch (e) {
      console.error(e);
    }
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
      // If updating totalCopies on a new book, sync availableCopies
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
                    ? 'Update metadata and stock information for this volume'
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
                  <div className="input-group">
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
                    placeholder="e.g. Addison-Wesley"
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
                  <div className="form-text small">Leave blank to use default book cover</div>
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold">Description / Synopsis</label>
                  <textarea
                    name="description"
                    rows="4"
                    className="form-control"
                    placeholder="Summary of the book..."
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
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Saving...
                    </>
                  ) : isEditing ? (
                    'Update Book'
                  ) : (
                    'Save to Catalog'
                  )}
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
