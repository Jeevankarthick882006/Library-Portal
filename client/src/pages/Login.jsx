// src/pages/Login.jsx - User Authentication Login Page
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Destination after login (defaults to /dashboard)
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Helper for 1-click demo login
  const setDemoCredentials = (role) => {
    if (role === 'admin') {
      setEmail('admin@library.com');
      setPassword('admin123');
    } else if (role === 'librarian') {
      setEmail('librarian@library.com');
      setPassword('librarian123');
    } else if (role === 'member') {
      setEmail('member@library.com');
      setPassword('member123');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-5">
          <div className="card shadow-sm border-0 p-4">
            <div className="text-center mb-4">
              <div className="d-inline-flex p-3 bg-primary-subtle text-primary rounded-circle mb-2">
                <i className="bi bi-shield-lock-fill fs-3"></i>
              </div>
              <h3 className="fw-bold text-dark">Portal Login</h3>
              <p className="text-muted small">Access your Library Portal dashboard</p>
            </div>

            {/* Quick Demo Login Helpers */}
            <div className="bg-light p-3 rounded-3 mb-4 border">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="small fw-bold text-secondary">
                  <i className="bi bi-lightning-charge-fill text-warning me-1"></i> Quick Demo Logins:
                </span>
              </div>
              <div className="d-flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setDemoCredentials('admin')}
                  className="btn btn-outline-danger btn-sm quick-login-btn"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => setDemoCredentials('librarian')}
                  className="btn btn-outline-warning text-dark btn-sm quick-login-btn"
                >
                  Librarian
                </button>
                <button
                  type="button"
                  onClick={() => setDemoCredentials('member')}
                  className="btn btn-outline-primary btn-sm quick-login-btn"
                >
                  Member
                </button>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger py-2 small d-flex align-items-center gap-2" role="alert">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <div>{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-white text-muted">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="name@library.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-white text-muted">
                    <i className="bi bi-key"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-semibold rounded-3 mb-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Logging in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="text-center mt-3 pt-3 border-top">
              <span className="text-muted small">Don't have an account? </span>
              <Link to="/register" className="small fw-bold text-decoration-none">
                Register as Member
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
