import React, { useState } from 'react';
import { FaHeadset, FaPhone, FaEnvelope, FaComments, FaTicketAlt, FaPlane, FaClock, FaCheckCircle } from 'react-icons/fa';

const HelpDesk = () => {
  const [activeTab, setActiveTab] = useState('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    bookingReference: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Your query has been submitted. We will respond within 24 hours.');
  };

  const contactMethods = [
    {
      icon: FaPhone,
      title: 'Phone Support',
      details: ['1800-SKY-VOY', 'Available 24/7'],
      primary: true
    },
    {
      icon: FaEnvelope,
      title: 'Email Support',
      details: ['support@skyvoyage.com', 'Response within 24 hours'],
      primary: false
    },
    {
      icon: FaComments,
      title: 'Live Chat',
      details: ['Available on website', 'Instant responses'],
      primary: false
    }
  ];

  const commonIssues = [
    {
      icon: FaTicketAlt,
      title: 'Booking Issues',
      solutions: ['Payment failures', 'Booking confirmation', 'Modification requests']
    },
    {
      icon: FaPlane,
      title: 'Flight Changes',
      solutions: ['Schedule changes', 'Cancellation process', 'Refund status']
    },
    {
      icon: FaClock,
      title: 'Check-in Problems',
      solutions: ['Web check-in issues', 'Seat selection', 'Boarding pass problems']
    }
  ];

  return (
    <div className="help-desk-page">
      {/* Hero Section */}
      <section className="help-hero">
        <div className="help-hero-content">
          <FaHeadset className="hero-icon" />
          <h1>Help Desk</h1>
          <p>24/7 customer support for all your travel needs</p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="contact-methods">
        <div className="container">
          <h2>How Can We Help You?</h2>
          <div className="contact-grid">
            {contactMethods.map((method, index) => (
              <div key={index} className={`contact-card ${method.primary ? 'primary' : ''}`}>
                <method.icon className="contact-icon" />
                <h3>{method.title}</h3>
                {method.details.map((detail, idx) => (
                  <p key={idx}>{detail}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="help-tabs">
        <div className="container">
          <div className="tab-navigation">
            <button 
              className={`tab-button ${activeTab === 'contact' ? 'active' : ''}`}
              onClick={() => setActiveTab('contact')}
            >
              Contact Form
            </button>
            <button 
              className={`tab-button ${activeTab === 'issues' ? 'active' : ''}`}
              onClick={() => setActiveTab('issues')}
            >
              Common Issues
            </button>
            <button 
              className={`tab-button ${activeTab === 'faq' ? 'active' : ''}`}
              onClick={() => setActiveTab('faq')}
            >
              FAQs
            </button>
          </div>

          {/* Contact Form Tab */}
          {activeTab === 'contact' && (
            <div className="tab-content">
              <div className="contact-form">
                <h3>Send Us a Message</h3>
                <form onSubmit={handleSubmit}>
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
                      <label htmlFor="bookingReference">Booking Reference (Optional)</label>
                      <input
                        type="text"
                        id="bookingReference"
                        name="bookingReference"
                        value={formData.bookingReference}
                        onChange={handleInputChange}
                        placeholder="e.g., SV123456"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label htmlFor="subject">Subject</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group full-width">
                      <label htmlFor="message">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={5}
                        required
                      />
                    </div>
                  </div>
                  <button type="submit" className="submit-button">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Common Issues Tab */}
          {activeTab === 'issues' && (
            <div className="tab-content">
              <div className="issues-grid">
                {commonIssues.map((issue, index) => (
                  <div key={index} className="issue-card">
                    <issue.icon className="issue-icon" />
                    <h3>{issue.title}</h3>
                    <ul>
                      {issue.solutions.map((solution, idx) => (
                        <li key={idx}>
                          <FaCheckCircle className="solution-icon" />
                          {solution}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="tab-content">
              <div className="faq-section">
                <div className="faq-item">
                  <h3>How do I modify my booking?</h3>
                  <p>You can modify your booking through the "Manage Booking" section or by calling our support team.</p>
                </div>
                <div className="faq-item">
                  <h3>What is the refund policy?</h3>
                  <p>Refund policies vary by ticket type. Refundable tickets offer full refund if cancelled 24 hours before departure.</p>
                </div>
                <div className="faq-item">
                  <h3>How do I check-in online?</h3>
                  <p>Web check-in opens 48 hours before departure. You can select seats and print your boarding pass.</p>
                </div>
                <div className="faq-item">
                  <h3>What is the baggage allowance?</h3>
                  <p>Economy class allows 20kg, Business class 30kg, and First class 40kg checked baggage.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="emergency-contact">
        <div className="container">
          <div className="emergency-card">
            <h3>Emergency Travel Assistance</h3>
            <p>For urgent travel issues within 24 hours of departure</p>
            <div className="emergency-details">
              <span className="emergency-number">🚨 1800-EMER-SKY</span>
              <span className="emergency-time">Available 24/7</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export { HelpDesk };
