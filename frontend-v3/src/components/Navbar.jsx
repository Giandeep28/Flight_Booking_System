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
          <div className="nav-dropdown">
            <NavLink to="/flights" className="nav-link">
              Flights <i className="fas fa-chevron-down"></i>
            </NavLink>
            <div className="dropdown-menu">
              <Link to="/flights/international" className="dropdown-item">
                <i className="fas fa-globe-americas"></i>
                International Routes
              </Link>
              <Link to="/flights/domestic" className="dropdown-item">
                <i className="fas fa-plane-departure"></i>
                Domestic Routes
              </Link>
              <Link to="/flights/status" className="dropdown-item">
                <i className="fas fa-clock"></i>
                Flight Status
              </Link>
              <Link to="/flights/checkin" className="dropdown-item">
                <i className="fas fa-ticket-alt"></i>
                Check-In
              </Link>
              <Link to="/flights/cargo" className="dropdown-item">
                <i className="fas fa-box"></i>
                Cargo Services
              </Link>
            </div>
          </div>
          <div className="nav-dropdown">
            <NavLink to="/support" className="nav-link">
              Support <i className="fas fa-chevron-down"></i>
            </NavLink>
            <div className="dropdown-menu">
              <Link to="/support/help-desk" className="dropdown-item">
                <i className="fas fa-headset"></i>
                Help Desk
              </Link>
              <Link to="/support/baggage" className="dropdown-item">
                <i className="fas fa-suitcase"></i>
                Baggage Info
              </Link>
              <Link to="/support/refund" className="dropdown-item">
                <i className="fas fa-undo"></i>
                Refund Policy
              </Link>
              <Link to="/support/assistance" className="dropdown-item">
                <i className="fas fa-wheelchair"></i>
                Special Assistance
              </Link>
              <Link to="/support/privacy" className="dropdown-item">
                <i className="fas fa-shield-alt"></i>
                Privacy Policy
              </Link>
            </div>
          </div>
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
          <div className="mobile-nav-section">
            <span className="mobile-nav-title">Flights</span>
            <Link to="/flights/international" className="mobile-nav-link">International Routes</Link>
            <Link to="/flights/domestic" className="mobile-nav-link">Domestic Routes</Link>
            <Link to="/flights/status" className="mobile-nav-link">Flight Status</Link>
            <Link to="/flights/checkin" className="mobile-nav-link">Check-In</Link>
            <Link to="/flights/cargo" className="mobile-nav-link">Cargo Services</Link>
          </div>
          <div className="mobile-nav-section">
            <span className="mobile-nav-title">Support</span>
            <Link to="/support/help-desk" className="mobile-nav-link">Help Desk</Link>
            <Link to="/support/baggage" className="mobile-nav-link">Baggage Info</Link>
            <Link to="/support/refund" className="mobile-nav-link">Refund Policy</Link>
            <Link to="/support/assistance" className="mobile-nav-link">Special Assistance</Link>
            <Link to="/support/privacy" className="mobile-nav-link">Privacy Policy</Link>
          </div>
          <Link to="/deals" className="mobile-nav-link">Deals</Link>
        </div>
      )}
    </nav>
  );
};

export { Navbar };
