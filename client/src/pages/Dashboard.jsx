// src/pages/Dashboard.jsx - Role-Aware Dashboard
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
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading dashboard...</span>
        </div>
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
      {/* Header Greeting */}
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

        {/* Quick Action Buttons for Staff */}
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

      {/* ADMIN & LIBRARIAN VIEW */}
      {isStaff && stats && (
        <>
          {/* Stat Cards Grid */}
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

          {/* Recent Loans and Recent Books Split */}
          <div className="row g-4">
            {/* Recent Lending Activities */}
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
                                  title="Mark as returned"
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

            {/* Quick Catalog Additions */}
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

      {/* MEMBER VIEW */}
      {isMember && (
        <>
          {/* Member Stat Cards */}
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

          {/* Member's Active Borrowed Books */}
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
