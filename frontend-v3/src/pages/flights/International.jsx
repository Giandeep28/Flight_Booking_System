import React from 'react';
import { FaGlobeAmericas, FaPlane, FaArrowRight } from 'react-icons/fa';

const International = () => {
  const popularRoutes = [
    { from: 'Delhi', to: 'New York', price: '₹65,999', duration: '15h 30m' },
    { from: 'Mumbai', to: 'London', price: '₹58,999', duration: '9h 45m' },
    { from: 'Bangalore', to: 'Singapore', price: '₹42,999', duration: '4h 30m' },
    { from: 'Chennai', to: 'Dubai', price: '₹38,999', duration: '3h 45m' },
    { from: 'Kolkata', to: 'Hong Kong', price: '₹51,999', duration: '5h 15m' },
    { from: 'Hyderabad', to: 'Frankfurt', price: '₹62,999', duration: '8h 20m' }
  ];

  const features = [
    { icon: FaGlobeAmericas, title: '150+ Destinations', desc: 'Connect to major cities worldwide' },
    { icon: FaPlane, title: 'Direct Flights', desc: 'Non-stop service to key hubs' },
    { icon: FaGlobeAmericas, title: 'Premium Cabins', desc: 'Business and First class options' },
    { icon: FaPlane, title: 'Global Partners', desc: 'Seamless connections with partner airlines' }
  ];

  return (
    <div className="international-page">
      {/* Features Section */}
      <div className="features-section">
        <h2>Why Choose Our International Routes?</h2>
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
        <h2>Popular International Routes</h2>
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
                  <span className="price">{route.price}</span>
                </div>
              </div>
              <button className="book-button">Book Now</button>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <h3>Ready to Explore the World?</h3>
        <p>Discover amazing destinations with our international network</p>
        <button className="cta-button">Search International Flights</button>
      </div>
    </div>
  );
};

export { International };
