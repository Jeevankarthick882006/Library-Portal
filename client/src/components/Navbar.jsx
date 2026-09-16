// src/components/Navbar.jsx - Top Navigation Bar
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

  // Fetch notifications when logged in
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated, location.pathname]);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
    } catch (e) {
      // silent fail if guest
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (e) {
      console.error(e);
    }
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
        {/* Brand with icon */}
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-4" to="/">
          <span className="p-2 bg-primary rounded-3 text-white d-inline-flex align-items-center justify-content-center shadow-sm">
            <i className="bi bi-journal-bookmark-fill fs-5"></i>
          </span>
          <span className="text-white">Library <span className="text-primary">Portal</span></span>
        </Link>

        {/* Mobile Toggle Button */}
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
          {/* Main Navigation Links */}
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

          {/* Right side authentication & user actions */}
          <div className="d-flex align-items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Notifications Dropdown */}
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

                  {/* Dropdown Box */}
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

                {/* User Profile & Role Info */}
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
