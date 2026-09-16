// src/pages/Home.jsx - Home Landing Page
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
      {/* Hero Section */}
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

              {/* Quick Search Form */}
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
                <div className="position-absolute bottom-0 start-0 translate-middle-y bg-white p-3 rounded-3 shadow border ms-3 d-none d-sm-block text-start">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-success-subtle text-success p-2 rounded-2">
                      <i className="bi bi-check-circle-fill fs-4"></i>
                    </div>
                    <div>
                      <div className="fw-bold small">Real-Time Lending</div>
                      <div className="text-muted smaller" style={{ fontSize: '0.75rem' }}>Auto copy tracking & dues</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights & Stats */}
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

      {/* Featured Books Preview */}
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
                    <div className="card-body d-flex flex-direction-column flex-column justify-content-between p-3">
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
