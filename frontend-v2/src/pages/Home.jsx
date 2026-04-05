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

      {/* Popular Destinations */}
      <section className="popular-destinations">
        <div className="container">
          <h2>Popular Destinations</h2>
          <div className="destinations-grid">
            <div className="destination-card">
              <div className="destination-image london"></div>
              <h3>London</h3>
              <p>From ₹58,999</p>
            </div>
            <div className="destination-card">
              <div className="destination-image dubai"></div>
              <h3>Dubai</h3>
              <p>From ₹38,999</p>
            </div>
            <div className="destination-card">
              <div className="destination-image singapore"></div>
              <h3>Singapore</h3>
              <p>From ₹42,999</p>
            </div>
            <div className="destination-card">
              <div className="destination-image newyork"></div>
              <h3>New York</h3>
              <p>From ₹65,999</p>
            </div>
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
