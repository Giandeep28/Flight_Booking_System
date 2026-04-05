import React, { useState } from 'react';
import { FaShieldAlt, FaLock, FaUser, FaDatabase, FaEye, FaCheckCircle } from 'react-icons/fa';

const Privacy = () => {
  const [activeSection, setActiveSection] = useState('collection');

  const sections = [
    {
      id: 'collection',
      title: 'Data Collection',
      icon: FaDatabase,
      content: 'We collect information necessary to provide our flight booking services and improve your travel experience.'
    },
    {
      id: 'usage',
      title: 'Data Usage',
      icon: FaUser,
      content: 'Your data is used to process bookings, provide customer support, and enhance our services.'
    },
    {
      id: 'protection',
      title: 'Data Protection',
      icon: FaLock,
      content: 'We implement industry-standard security measures to protect your personal information.'
    },
    {
      id: 'rights',
      title: 'Your Rights',
      icon: FaEye,
      content: 'You have the right to access, modify, or delete your personal data at any time.'
    }
  ];

  const dataTypes = [
    {
      category: 'Personal Information',
      items: ['Name', 'Email address', 'Phone number', 'Date of birth', 'Gender'],
      purpose: 'Account management and booking processing'
    },
    {
      category: 'Travel Information',
      items: ['Flight preferences', 'Travel history', 'Frequent flyer details', 'Passport information'],
      purpose: 'Booking services and personalized recommendations'
    },
    {
      category: 'Payment Information',
      items: ['Credit/debit card details', 'Bank account information', 'Billing address'],
      purpose: 'Payment processing and transaction security'
    },
    {
      category: 'Usage Data',
      items: ['Website usage patterns', 'Search history', 'Device information', 'IP address'],
      purpose: 'Service improvement and security monitoring'
    }
  ];

  const rights = [
    {
      title: 'Right to Access',
      description: 'You can request a copy of all personal data we hold about you.',
      process: 'Submit request through privacy@skyvoyage.com'
    },
    {
      title: 'Right to Rectification',
      description: 'You can correct inaccurate or incomplete personal data.',
      process: 'Update your profile or contact our support team'
    },
    {
      title: 'Right to Erasure',
      description: 'You can request deletion of your personal data in certain circumstances.',
      process: 'Submit deletion request with verification'
    },
    {
      title: 'Right to Portability',
      description: 'You can request transfer of your data to another service provider.',
      process: 'Contact our data protection officer'
    }
  ];

  const securityMeasures = [
    {
      measure: 'Encryption',
      description: 'All sensitive data is encrypted using industry-standard protocols',
      level: 'High'
    },
    {
      measure: 'Access Control',
      description: 'Strict access controls limit data access to authorized personnel only',
      level: 'High'
    },
    {
      measure: 'Regular Audits',
      description: 'Regular security audits and penetration testing',
      level: 'Medium'
    },
    {
      measure: 'Data Backup',
      description: 'Secure backup systems with redundancy and disaster recovery',
      level: 'High'
    }
  ];

  return (
    <div className="privacy-page">
      {/* Navigation */}
      <div className="privacy-nav">
        <h2>Privacy Policy Sections</h2>
        <div className="nav-tabs">
          {sections.map((section) => (
            <button
              key={section.id}
              className={`nav-tab ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              <section.icon className="tab-icon" />
              {section.title}
            </button>
          ))}
        </div>
      </div>

      {/* Content Sections */}
      <div className="privacy-content">
        {/* Data Collection */}
        {activeSection === 'collection' && (
          <div className="content-section">
            <h3>Information We Collect</h3>
            <div className="data-types-grid">
              {dataTypes.map((type, index) => (
                <div key={index} className="data-type-card">
                  <h4>{type.category}</h4>
                  <ul className="data-items">
                    {type.items.map((item, idx) => (
                      <li key={idx}>
                        <FaCheckCircle className="item-icon" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="purpose">
                    <strong>Purpose:</strong> {type.purpose}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Data Usage */}
        {activeSection === 'usage' && (
          <div className="content-section">
            <h3>How We Use Your Information</h3>
            <div className="usage-grid">
              <div className="usage-card">
                <h4>Service Delivery</h4>
                <p>Processing bookings, managing reservations, and providing customer support</p>
              </div>
              <div className="usage-card">
                <h4>Personalization</h4>
                <p>Customizing travel recommendations and offers based on your preferences</p>
              </div>
              <div className="usage-card">
                <h4>Communication</h4>
                <p>Sending booking confirmations, updates, and relevant travel information</p>
              </div>
              <div className="usage-card">
                <h4>Analytics</h4>
                <p>Analyzing usage patterns to improve our services and user experience</p>
              </div>
            </div>
          </div>
        )}

        {/* Data Protection */}
        {activeSection === 'protection' && (
          <div className="content-section">
            <h3>Security Measures</h3>
            <div className="security-grid">
              {securityMeasures.map((measure, index) => (
                <div key={index} className={`security-card ${measure.level.toLowerCase()}`}>
                  <FaShieldAlt className="security-icon" />
                  <h4>{measure.measure}</h4>
                  <p>{measure.description}</p>
                  <div className="security-level">
                    <span className="level-label">Security Level:</span>
                    <span className={`level ${measure.level.toLowerCase()}`}>{measure.level}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Your Rights */}
        {activeSection === 'rights' && (
          <div className="content-section">
            <h3>Your Data Rights</h3>
            <div className="rights-grid">
              {rights.map((right, index) => (
                <div key={index} className="right-card">
                  <h4>{right.title}</h4>
                  <p>{right.description}</p>
                  <div className="process">
                    <strong>Process:</strong> {right.process}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Policy Details */}
      <div className="policy-details">
        <h2>Policy Details</h2>
        
        <div className="policy-section">
          <h3>Data Retention</h3>
          <p>We retain your personal data only as long as necessary to fulfill the purposes for which it was collected, including legal, accounting, or reporting requirements.</p>
          <ul>
            <li>Booking data: 7 years after travel completion</li>
            <li>Account information: Until account deletion</li>
            <li>Marketing preferences: Until you withdraw consent</li>
          </ul>
        </div>

        <div className="policy-section">
          <h3>Third-Party Sharing</h3>
          <p>We may share your data with trusted third parties only when necessary:</p>
          <ul>
            <li>Airlines and travel partners for booking fulfillment</li>
            <li>Payment processors for secure transactions</li>
            <li>Government authorities as required by law</li>
            <li>Service providers with strict data protection agreements</li>
          </ul>
        </div>

        <div className="policy-section">
          <h3>International Data Transfers</h3>
          <p>Your data may be transferred internationally for service delivery. We ensure adequate protection through:</p>
          <ul>
            <li>Standard contractual clauses with international partners</li>
            <li>Adequacy decisions for approved countries</li>
            <li>Binding corporate rules within our organization</li>
          </ul>
        </div>

        <div className="policy-section">
          <h3>Cookies and Tracking</h3>
          <p>We use cookies to enhance your experience:</p>
          <ul>
            <li>Essential cookies for basic functionality</li>
            <li>Performance cookies for service improvement</li>
            <li>Marketing cookies for personalized offers</li>
            <li>You can manage cookie preferences in your browser settings</li>
          </ul>
        </div>
      </div>

      {/* Contact Information */}
      <div className="contact-section">
        <h2>Data Protection Officer</h2>
        <div className="contact-grid">
          <div className="contact-card">
            <FaShieldAlt className="contact-icon" />
            <h3>Privacy Concerns</h3>
            <p>privacy@skyvoyage.com</p>
            <p>For all privacy-related inquiries and complaints</p>
          </div>
          <div className="contact-card">
            <FaLock className="contact-icon" />
            <h3>Data Security</h3>
            <p>security@skyvoyage.com</p>
            <p>For security incidents and data breach concerns</p>
          </div>
          <div className="contact-card">
            <FaUser className="contact-icon" />
            <h3>Subject Access Requests</h3>
            <p>dpo@skyvoyage.com</p>
            <p>For accessing or correcting your personal data</p>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="update-section">
        <p><strong>Last Updated:</strong> April 1, 2026</p>
        <p>This privacy policy may be updated periodically. We will notify you of significant changes.</p>
      </div>
    </div>
  );
};

export { Privacy };
