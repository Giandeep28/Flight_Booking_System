import React from 'react';
import { FaPlane, FaArrowRight, FaClock } from 'react-icons/fa';

const Domestic = () => {
  const popularRoutes = [
    { from: 'Delhi', to: 'Mumbai', price: '₹4,999', duration: '2h 15m', frequency: 'Hourly' },
    { from: 'Bangalore', to: 'Delhi', price: '₹5,299', duration: '2h 45m', frequency: 'Every 30 min' },
    { from: 'Mumbai', to: 'Chennai', price: '₹3,899', duration: '1h 50m', frequency: 'Every 2 hours' },
    { from: 'Kolkata', to: 'Delhi', price: '₹4,599', duration: '2h 30m', frequency: 'Every 45 min' },
    { from: 'Hyderabad', to: 'Mumbai', price: '₹3,599', duration: '1h 30m', frequency: 'Hourly' },
    { from: 'Pune', to: 'Delhi', price: '₹4,299', duration: '2h 20m', frequency: 'Every 2 hours' }
  ];

  const features = [
    { icon: FaPlane, title: '25+ Cities', desc: 'Extensive domestic network across India' },
    { icon: FaClock, title: 'High Frequency', desc: 'Multiple flights daily on major routes' },
    { icon: FaPlane, title: 'Quick Connections', desc: 'Short layovers and seamless transfers' },
    { icon: FaClock, title: 'Flexible Timing', desc: 'Early morning to late night flights' }
  ];

  return (
    <div className="domestic-page">
      {/* Features Section */}
      <div className="features-section">
        <h2>Why Choose Our Domestic Routes?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <feature.icon className="feature-icon" />
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Routes */}
      <div className="routes-section">
        <h2>Popular Domestic Routes</h2>
        <div className="routes-grid">
          {popularRoutes.map((route, index) => (
            <div key={index} className="route-card">
              <div className="route-info">
                <div className="route-cities">
                  <span className="city">{route.from}</span>
                  <FaArrowRight className="arrow-icon" />
                  <span className="city">{route.to}</span>
                </div>
                <div className="route-details">
                  <span className="duration">{route.duration}</span>
                  <span className="frequency">{route.frequency}</span>
                  <span className="price">{route.price}</span>
                </div>
              </div>
              <button className="book-button">Book Now</button>
            </div>
          ))}
        </div>
      </div>

      {/* Hub Information */}
      <div className="hub-section">
        <h2>Major Domestic Hubs</h2>
        <div className="hub-grid">
          <div className="hub-card">
            <h3>Delhi (DEL)</h3>
            <p>Primary hub with connections to all major cities</p>
          </div>
          <div className="hub-card">
            <h3>Mumbai (BOM)</h3>
            <p>Western hub with extensive network coverage</p>
          </div>
          <div className="hub-card">
            <h3>Bangalore (BLR)</h3>
            <p>Southern hub with modern facilities</p>
          </div>
          <div className="hub-card">
            <h3>Kolkata (CCU)</h3>
            <p>Eastern hub with regional connectivity</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <h3>Explore India with SkyVoyage</h3>
        <p>Connect seamlessly across the country with our domestic network</p>
        <button className="cta-button">Search Domestic Flights</button>
      </div>
    </div>
  );
};

export { Domestic };
