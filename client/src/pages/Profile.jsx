// src/pages/Profile.jsx - User Profile & Borrowing History
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
        {/* Left Column: Profile Card & Edit Form */}
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

        {/* Right Column: Personal Loan History */}
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
