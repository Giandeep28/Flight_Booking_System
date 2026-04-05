import React, { useState } from 'react';
import { FaBox, FaWeight, FaClock, FaCheckCircle, FaPlane } from 'react-icons/fa';

const Cargo = () => {
  const [cargoData, setCargoData] = useState({
    origin: '',
    destination: '',
    weight: '',
    dimensions: '',
    cargoType: 'general'
  });

  const handleInputChange = (e) => {
    setCargoData({
      ...cargoData,
      [e.target.name]: e.target.value
    });
  };

  const handleQuote = (e) => {
    e.preventDefault();
    // Simulate quote calculation
    alert('Quote calculation feature coming soon!');
  };

  const services = [
    {
      icon: FaBox,
      title: 'Express Cargo',
      desc: 'Fast delivery for urgent shipments',
      time: '24-48 hours',
      features: ['Priority handling', 'Real-time tracking', 'Door delivery']
    },
    {
      icon: FaPlane,
      title: 'Standard Cargo',
      desc: 'Reliable shipping for regular needs',
      time: '3-5 days',
      features: ['Cost-effective', 'Secure packaging', 'Insurance options']
    },
    {
      icon: FaWeight,
      title: 'Heavy Cargo',
      desc: 'Specialized handling for heavy items',
      time: '5-7 days',
      features: ['Special equipment', 'Custom clearance', 'Dedicated support']
    },
    {
      icon: FaClock,
      title: 'Time-Critical',
      desc: 'Expedited shipping for time-sensitive cargo',
      time: '12-24 hours',
      features: ['Expedited processing', 'Priority boarding', 'Fastest delivery']
    }
  ];

  const restrictions = [
    'Hazardous materials',
    'Perishable items (special handling required)',
    'Live animals (special arrangements needed)',
    'Valuables and jewelry',
    'Illegal items',
    'Oversized items (prior approval required)'
  ];

  return (
    <div className="cargo-page">
      {/* Quote Form */}
      <div className="quote-section">
        <h2>Get Cargo Quote</h2>
        <p>Calculate shipping costs for your cargo</p>
        
        <form onSubmit={handleQuote} className="quote-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="origin">Origin City</label>
              <input
                type="text"
                id="origin"
                name="origin"
                value={cargoData.origin}
                onChange={handleInputChange}
                placeholder="e.g., Delhi"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="destination">Destination City</label>
              <input
                type="text"
                id="destination"
                name="destination"
                value={cargoData.destination}
                onChange={handleInputChange}
                placeholder="e.g., Mumbai"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="weight">Weight (kg)</label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={cargoData.weight}
                onChange={handleInputChange}
                placeholder="e.g., 50"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="dimensions">Dimensions (LxWxH cm)</label>
              <input
                type="text"
                id="dimensions"
                name="dimensions"
                value={cargoData.dimensions}
                onChange={handleInputChange}
                placeholder="e.g., 50x40x30"
                required
              />
            </div>
            <div className="form-group full-width">
              <label htmlFor="cargoType">Cargo Type</label>
              <select
                id="cargoType"
                name="cargoType"
                value={cargoData.cargoType}
                onChange={handleInputChange}
              >
                <option value="general">General Cargo</option>
                <option value="fragile">Fragile Items</option>
                <option value="electronics">Electronics</option>
                <option value="documents">Documents</option>
                <option value="perishable">Perishable Items</option>
              </select>
            </div>
          </div>
          <button type="submit" className="quote-button">
            Get Instant Quote
          </button>
        </form>
      </div>

      {/* Services */}
      <div className="services-section">
        <h2>Our Cargo Services</h2>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <service.icon className="service-icon" />
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
              <div className="service-time">
                <FaClock className="time-icon" />
                <span>{service.time}</span>
              </div>
              <ul className="service-features">
                {service.features.map((feature, idx) => (
                  <li key={idx}>
                    <FaCheckCircle className="check-icon" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="select-button">Select Service</button>
            </div>
          ))}
        </div>
      </div>

      {/* Restrictions */}
      <div className="restrictions-section">
        <h2>Shipping Restrictions</h2>
        <div className="restrictions-content">
          <p>The following items are restricted or require special handling:</p>
          <ul className="restrictions-list">
            {restrictions.map((restriction, index) => (
              <li key={index}>
                <FaBox className="restriction-icon" />
                {restriction}
              </li>
            ))}
          </ul>
          <div className="restriction-note">
            <h3>Need Help?</h3>
            <p>For restricted items or special requirements, please contact our cargo team at cargo@skyvoyage.com</p>
          </div>
        </div>
      </div>

      {/* Tracking */}
      <div className="tracking-section">
        <h2>Track Your Cargo</h2>
        <div className="tracking-form">
          <input
            type="text"
            placeholder="Enter tracking number"
            className="tracking-input"
          />
          <button className="track-button">Track Now</button>
        </div>
      </div>
    </div>
  );
};

export { Cargo };
