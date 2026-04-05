import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const PageLayout = ({ title, subtitle, icon, children }) => {
  return (
    <div className="page-layout">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="container">
          <Link to="/" className="breadcrumb-link">
            <FaHome className="breadcrumb-icon" />
            Home
          </Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{title}</span>
        </div>
      </div>

      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <div className="header-content">
            <div className="header-icon">
              <i className={icon}></i>
            </div>
            <div className="header-text">
              <h1>{title}</h1>
              <p>{subtitle}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Page Content */}
      <section className="page-content">
        <div className="container">
          {children}
        </div>
      </section>
    </div>
  );
};

export { PageLayout };
