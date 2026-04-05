import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <FaExclamationTriangle className="error-icon" />
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="home-button">
          <FaHome />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export { NotFound };
