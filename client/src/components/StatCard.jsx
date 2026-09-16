// src/components/StatCard.jsx - Metric Card Component
import React from 'react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon, color = 'primary', linkText, to }) => {
  return (
    <div className="card stat-card shadow-sm h-100 border-0">
      <div className="card-body p-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <span className="text-muted fw-semibold small text-uppercase tracking-wider">{title}</span>
          <div className={`stat-icon bg-${color}-subtle text-${color}`}>
            <i className={`bi ${icon}`}></i>
          </div>
        </div>
        <h2 className="display-6 fw-bold mb-0 text-dark">{value}</h2>

        {to && (
          <div className="mt-3 pt-2 border-top">
            <Link to={to} className={`text-${color} text-decoration-none small fw-semibold d-inline-flex align-items-center gap-1`}>
              {linkText || 'View details'} <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
