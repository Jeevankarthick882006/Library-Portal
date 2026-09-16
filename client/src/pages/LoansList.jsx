// src/pages/LoansList.jsx - Book Lending & Loan Management
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

  // Issue Loan Modal state
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

  // When opening issue modal, fetch available books and members
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
      console.error(err);
      setFeedback({ type: 'danger', message: 'Failed to load loans' });
    } finally {
      setLoading(false);
    }
  };

  const openIssueModal = async () => {
    try {
      setShowIssueModal(true);
      // Fetch books and members
      const [booksRes, membersRes] = await Promise.all([
        api.get('/books'),
        api.get('/members'),
      ]);
      setBooksList(booksRes.data.books.filter((b) => b.availableCopies > 0));
      setMembersList(membersRes.data);
    } catch (e) {
      console.error('Error preparing issue modal:', e);
    }
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

  // Client-side search filter by title or member name
  const filteredLoans = loans.filter((l) => {
    const q = searchTerm.toLowerCase();
    const title = l.book?.title?.toLowerCase() || '';
    const memberName = l.member?.name?.toLowerCase() || '';
    const memberCode = l.member?.memberCode?.toLowerCase() || '';
    return title.includes(q) || memberName.includes(q) || memberCode.includes(q);
  });

  return (
    <div className="container py-4">
      {/* Header */}
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

      {/* Filter and Search controls */}
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

      {/* Loans Table */}
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
                              title="Process Book Return"
                            >
                              Return
                            </button>
                          )}
                          {isAdmin && (
                            <button
                              onClick={() => handleDeleteLoan(loan._id)}
                              className="btn btn-outline-danger btn-sm rounded-circle p-1 px-2"
                              title="Delete Record"
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

      {/* ISSUE BOOK MODAL */}
      {showIssueModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Issue Book to Member</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowIssueModal(false)}
                ></button>
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
                    <div className="form-text small">Standard checkout is 14 days</div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Internal Notes (Optional)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Issued for semester research"
                      value={issueForm.notes}
                      onChange={(e) => setIssueForm({ ...issueForm, notes: e.target.value })}
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-light border"
                    onClick={() => setShowIssueModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={issueLoading}
                    className="btn btn-primary px-4 fw-semibold"
                  >
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
