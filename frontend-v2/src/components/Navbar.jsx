import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaPlane, FaSearch, FaUser, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <FaPlane className="logo-icon" />
          <span>SKYVOYAGE</span>
        </Link>

        <div className="nav-menu">
          <NavLink to="/" className="nav-link" end>Home</NavLink>
          <NavLink to="/flights" className="nav-link">Flights</NavLink>
          <NavLink to="/manage-booking" className="nav-link">Manage Booking</NavLink>
          <NavLink to="/deals" className="nav-link">Deals</NavLink>
        </div>

        <div className="nav-actions">
          <button className="search-btn">
            <FaSearch />
          </button>
          <Link to="/profile" className="profile-btn">
            <FaUser />
          </Link>
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <Link to="/" className="mobile-nav-link">Home</Link>
          <Link to="/flights" className="mobile-nav-link">Flights</Link>
          <Link to="/manage-booking" className="mobile-nav-link">Manage Booking</Link>
          <Link to="/deals" className="mobile-nav-link">Deals</Link>
        </div>
      )}
    </nav>
  );
};

export { Navbar };
