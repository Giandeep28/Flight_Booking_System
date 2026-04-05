import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaPlane, FaGlobeAmericas, FaClock, FaTicketAlt, FaBox } from 'react-icons/fa';

const ServicePage = ({ title, description, icon: Icon }) => {
  // Service-specific content configurations
  const serviceContent = {
    'International Routes': {
      hero: 'Explore the World',
      subtitle: '150+ International Destinations',
      features: [
        'Direct flights to major global hubs',
        'Seamless connections worldwide',
        'Competitive international fares',
        'Premium cabin options'
      ],
      popularRoutes: [
        { from: 'Delhi', to: 'New York', price: '₹65,999' },
        { from: 'Mumbai', to: 'London', price: '₹58,999' },
        { from: 'Bangalore', to: 'Singapore', price: '₹42,999' },
        { from: 'Chennai', to: 'Dubai', price: '₹38,999' }
      ]
    },
    'Domestic Hubs': {
      hero: 'Connect India',
      subtitle: '25+ Domestic Cities',
      features: [
        'Hourly flights between metros',
        'Regional connectivity',
        'Economy to business class',
        'Special domestic fares'
      ],
      popularRoutes: [
        { from: 'Delhi', to: 'Mumbai', price: '₹4,999' },
        { from: 'Bangalore', to: 'Delhi', price: '₹5,299' },
        { from: 'Mumbai', to: 'Chennai', price: '₹3,899' },
        { from: 'Kolkata', to: 'Delhi', price: '₹4,599' }
      ]
    },
    'Flight Status': {
      hero: 'Track Your Flight',
      subtitle: 'Real-time Updates',
      features: [
        'Live flight tracking',
        'Gate information',
        'Delay notifications',
        'Mobile alerts'
      ],
      ctaText: 'Check Flight Status',
      ctaLink: '/flight-tracker'
    },
    'Check-In': {
      hero: 'Web Check-In',
      subtitle: 'Skip the Queue',
      features: [
        'Check-in 48 hours before',
        'Select seats online',
        'Print boarding pass',
        'Mobile boarding pass'
      ],
      ctaText: 'Check-In Now',
      ctaLink: '/web-checkin'
    },
    'Cargo Services': {
      hero: 'Ship with Confidence',
      subtitle: 'Reliable Cargo Solutions',
      features: [
        'Express cargo delivery',
        'Tracking services',
        'Special handling',
        'Corporate solutions'
      ],
      ctaText: 'Book Cargo',
      ctaLink: '/cargo-booking'
    }
  };

  const content = serviceContent[title] || {
    hero: title,
    subtitle: description,
    features: ['Premium service', '24/7 support', 'Best rates'],
    ctaText: 'Learn More',
    ctaLink: '#'
  };

  return (
    <div className="service-page">
      {/* Hero Section */}
      <section className="service-hero">
        <div className="service-hero-content">
          <div className="service-icon">
            <Icon />
          </div>
          <h1>{content.hero}</h1>
          <p>{content.subtitle}</p>
          <p className="service-description">{description}</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="service-features">
        <div className="container">
          <h2>Why Choose SkyVoyage {title}?</h2>
          <div className="features-grid">
            {content.features.map((feature, index) => (
              <div key={index} className="feature-card">
                <FaPlane className="feature-icon" />
                <h3>{feature}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes (for route services) */}
      {content.popularRoutes && (
        <section className="popular-routes">
          <div className="container">
            <h2>Popular Routes</h2>
            <div className="routes-grid">
              {content.popularRoutes.map((route, index) => (
                <div key={index} className="route-card">
                  <div className="route-info">
                    <div className="route-city">
                      <span>{route.from}</span>
                      <FaArrowRight className="route-arrow" />
                      <span>{route.to}</span>
                    </div>
                    <div className="route-price">{route.price}</div>
                  </div>
                  <button className="route-btn">Book Now</button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="service-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Experience the best {title.toLowerCase()} with SkyVoyage</p>
            <Link to={content.ctaLink} className="cta-button">
              {content.ctaText}
              <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export { ServicePage };
