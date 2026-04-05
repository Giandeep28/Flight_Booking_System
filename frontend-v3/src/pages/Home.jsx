import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaPlane, FaGlobeAmericas, FaShieldAlt, FaHeadset } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Elegance in the Skies</h1>
          <p>Experience premium travel with SkyVoyage - Your trusted partner for seamless journeys</p>
          <Link to="/flights" className="hero-cta">
            <FaSearch />
            Search Flights
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <h2>Why Choose SkyVoyage?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <FaGlobeAmericas className="feature-icon" />
              <h3>Global Network</h3>
              <p>150+ destinations worldwide with seamless connections</p>
            </div>
            <div className="feature-card">
              <FaPlane className="feature-icon" />
              <h3>Modern Fleet</h3>
              <p>Fly with the latest aircraft for maximum comfort</p>
            </div>
            <div className="feature-card">
              <FaShieldAlt className="feature-icon" />
              <h3>Safe Travel</h3>
              <p>Industry-leading safety standards and protocols</p>
            </div>
            <div className="feature-card">
              <FaHeadset className="feature-icon" />
              <h3>24/7 Support</h3>
              <p>Dedicated customer assistance round the clock</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="quick-access">
        <div className="container">
          <h2>Quick Access</h2>
          <div className="quick-grid">
            <Link to="/flights/status" className="quick-card">
              <i className="fas fa-clock"></i>
              <h3>Flight Status</h3>
              <p>Track real-time updates</p>
            </Link>
            <Link to="/flights/checkin" className="quick-card">
              <i className="fas fa-ticket-alt"></i>
              <h3>Web Check-In</h3>
              <p>Skip the queue</p>
            </Link>
            <Link to="/support/help-desk" className="quick-card">
              <i className="fas fa-headset"></i>
              <h3>Help Desk</h3>
              <p>24/7 support</p>
            </Link>
            <Link to="/support/baggage" className="quick-card">
              <i className="fas fa-suitcase"></i>
              <h3>Baggage Info</h3>
              <p>Policy details</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="home-cta">
        <div className="container">
          <h2>Start Your Journey Today</h2>
          <p>Join millions of satisfied travelers who trust SkyVoyage</p>
          <Link to="/flights" className="cta-button">
            Book Your Flight
          </Link>
        </div>
      </section>
    </div>
  );
};

export { Home };
