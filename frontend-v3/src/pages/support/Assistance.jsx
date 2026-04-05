import React, { useState } from 'react';
import { FaWheelchair, FaPhone, FaCheckCircle, FaHeartbeat, FaEye, FaEar, FaBaby } from 'react-icons/fa';

const Assistance = () => {
  const [selectedService, setSelectedService] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    flightNumber: '',
    travelDate: '',
    assistanceType: '',
    specialNeeds: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Special assistance request submitted successfully!');
  };

  const services = [
    {
      icon: FaWheelchair,
      title: 'Wheelchair Assistance',
      desc: 'Mobility assistance throughout your journey',
      features: ['Airport wheelchair', 'Aisle chair', 'Assistance to seat', 'Priority boarding'],
      notice: '48 hours notice required'
    },
    {
      icon: FaHeartbeat,
      title: 'Medical Support',
      desc: 'Special medical equipment and support',
      features: ['Oxygen on board', 'Medical equipment transport', ' stretcher service', 'Medical escort'],
      notice: '72 hours notice required'
    },
    {
      icon: FaEye,
      title: 'Visual Impairment',
      desc: 'Assistance for visually impaired passengers',
      features: ['Braille signage', 'Personal assistance', 'Audio announcements', 'Guide dog support'],
      notice: '24 hours notice required'
    },
    {
      icon: FaEar,
      title: 'Hearing Impairment',
      desc: 'Support for hearing impaired passengers',
      features: ['Visual alerts', 'Written communication', 'Sign language assistance', 'Vibrating devices'],
      notice: '24 hours notice required'
    },
    {
      icon: FaBaby,
      title: 'Family Support',
      desc: 'Assistance for families with children',
      features: ['Baby bassinet', 'Priority boarding', 'Family seating', 'Child care assistance'],
      notice: '24 hours notice required'
    }
  ];

  const guidelines = [
    {
      title: 'Booking Process',
      points: [
        'Request assistance at time of booking',
        'Provide detailed information about your needs',
        'Submit medical certificates if required',
        'Confirm assistance 24 hours before travel'
      ]
    },
    {
      title: 'Airport Process',
      points: [
        'Arrive 2 hours before domestic flights',
        'Arrive 3 hours before international flights',
        'Visit special assistance counter',
        'Our staff will assist throughout'
      ]
    },
    {
      title: 'On Board Support',
      points: [
        'Pre-boarding assistance available',
        'Special seating arrangements',
        'Crew trained for special needs',
        'Emergency support protocols in place'
      ]
    }
  ];

  return (
    <div className="assistance-page">
      {/* Services Overview */}
      <div className="services-section">
        <h2>Special Assistance Services</h2>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <service.icon className="service-icon" />
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
              <ul className="service-features">
                {service.features.map((feature, idx) => (
                  <li key={idx}>
                    <FaCheckCircle className="check-icon" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="service-notice">
                <FaPhone className="notice-icon" />
                <span>{service.notice}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Request Form */}
      <div className="request-section">
        <h2>Request Special Assistance</h2>
        <p>Fill this form to arrange special assistance for your journey</p>
        
        <form onSubmit={handleSubmit} className="assistance-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="flightNumber">Flight Number</label>
              <input
                type="text"
                id="flightNumber"
                name="flightNumber"
                value={formData.flightNumber}
                onChange={handleInputChange}
                placeholder="e.g., SV-202"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="travelDate">Travel Date</label>
              <input
                type="date"
                id="travelDate"
                name="travelDate"
                value={formData.travelDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="assistanceType">Type of Assistance</label>
              <select
                id="assistanceType"
                name="assistanceType"
                value={formData.assistanceType}
                onChange={handleInputChange}
                required
              >
                <option value="">Select assistance type</option>
                <option value="wheelchair">Wheelchair Assistance</option>
                <option value="medical">Medical Support</option>
                <option value="visual">Visual Impairment</option>
                <option value="hearing">Hearing Impairment</option>
                <option value="family">Family Support</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group full-width">
              <label htmlFor="specialNeeds">Special Requirements</label>
              <textarea
                id="specialNeeds"
                name="specialNeeds"
                value={formData.specialNeeds}
                onChange={handleInputChange}
                rows={4}
                placeholder="Please describe your specific needs..."
              />
            </div>
          </div>
          <button type="submit" className="submit-button">
            Submit Request
          </button>
        </form>
      </div>

      {/* Guidelines */}
      <div className="guidelines-section">
        <h2>Important Guidelines</h2>
        <div className="guidelines-grid">
          {guidelines.map((guideline, index) => (
            <div key={index} className="guideline-card">
              <h3>{guideline.title}</h3>
              <ul>
                {guideline.points.map((point, idx) => (
                  <li key={idx}>
                    <FaCheckCircle className="guideline-icon" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div className="contact-section">
        <h2>Special Assistance Desk</h2>
        <div className="contact-grid">
          <div className="contact-card">
            <FaPhone className="contact-icon" />
            <h3>24/7 Helpline</h3>
            <p>1800-SKY-SPEC</p>
            <p>Available round the clock for urgent assistance</p>
          </div>
          <div className="contact-card">
            <FaHeartbeat className="contact-icon" />
            <h3>Medical Support</h3>
            <p>medical@skyvoyage.com</p>
            <p>For medical equipment and health-related queries</p>
          </div>
          <div className="contact-card">
            <FaWheelchair className="contact-icon" />
            <h3>Accessibility Team</h3>
            <p>accessibility@skyvoyage.com</p>
            <p>For all accessibility and special needs support</p>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="emergency-section">
        <div className="emergency-card">
          <h3>Emergency Assistance</h3>
          <p>For last-minute assistance requests (less than 24 hours before travel)</p>
          <div className="emergency-details">
            <span className="emergency-number">🚨 1800-EMER-SKY</span>
            <span className="emergency-time">Available 24/7</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Assistance };
