// src/components/Footer.jsx - Bottom Footer Component
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-top py-4 mt-auto">
      <div className="container">
        <div className="row align-items-center justify-content-between gy-3">
          <div className="col-md-6 text-center text-md-start">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-1">
              <i className="bi bi-journal-bookmark-fill text-primary"></i>
              <span className="fw-bold text-dark">Library Portal</span>
              <span className="badge bg-light text-secondary border">MERN Stack</span>
            </div>
            <p className="text-muted small mb-0">
              Modern Knowledge, Book Lending & Inventory Management System.
            </p>
          </div>

          <div className="col-md-6 text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end gap-3 small text-muted">
              <Link to="/books" className="text-decoration-none text-muted">Catalog</Link>
              <span>•</span>
              <Link to="/login" className="text-decoration-none text-muted">Portal Login</Link>
              <span>•</span>
              <span className="text-success"><i className="bi bi-shield-check me-1"></i>System Active</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
