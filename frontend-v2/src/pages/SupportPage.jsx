import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaHeadset, FaSuitcase, FaUndo, FaWheelchair, FaShieldAlt,
  FaArrowRight, FaPhone, FaEnvelope, FaClock, FaCheckCircle
} from 'react-icons/fa';

const SupportPage = ({ title, description, icon: Icon }) => {
  // Support-specific content configurations
  const supportContent = {
    'Help Desk': {
      hero: 'We\'re Here to Help',
      subtitle: '24/7 Customer Support',
      contactMethods: [
        { type: 'Phone', value: '1800-SKY-VOY', icon: FaPhone },
        { type: 'Email', value: 'support@skyvoyage.com', icon: FaEnvelope },
        { type: 'Live Chat', value: 'Available 24/7', icon: FaHeadset }
      ],
      commonIssues: [
        'Booking modifications',
        'Payment issues',
        'Flight changes',
        'Refund inquiries'
      ]
    },
    'Baggage Information': {
      hero: 'Baggage Guidelines',
      subtitle: 'Everything You Need to Know',
      allowances: [
        { class: 'Economy', weight: '20kg', pieces: 1 },
        { class: 'Business', weight: '30kg', pieces: 2 },
        { class: 'First', weight: '40kg', pieces: 2 }
      ],
      restrictions: [
        'No liquids over 100ml in carry-on',
        'Weight limit: 23kg per piece',
        'Size limit: 158cm total dimensions',
        'Extra baggage charges apply'
      ]
    },
    'Refund Policy': {
      hero: 'Fair & Transparent',
      subtitle: 'Refund & Cancellation Policy',
      policies: [
        {
          type: 'Refundable Tickets',
          description: 'Full refund if cancelled 24 hours before departure'
        },
        {
          type: 'Non-Refundable Tickets',
          description: 'No refund, but credit available for future travel'
        },
        {
          type: 'Partial Refund',
          description: '50% refund for cancellations 2-24 hours before departure'
        },
        {
          type: 'No Show',
          description: 'No refund for missed flights'
        }
      ]
    },
    'Special Assistance': {
      hero: 'Travel with Comfort',
      subtitle: 'Special Assistance Services',
      services: [
        { name: 'Wheelchair Assistance', desc: 'Available at all airports' },
        { name: 'Medical Support', desc: 'Special medical equipment on request' },
        { name: 'Visual Impairment Support', desc: 'Braille signage and assistance' },
        { name: 'Hearing Impairment Support', desc: 'Visual alerts and assistance' }
      ]
    },
    'Privacy Policy': {
      hero: 'Your Privacy Matters',
      subtitle: 'Data Protection & Privacy',
      sections: [
        {
          title: 'Data Collection',
          content: 'We collect only essential information for booking and travel services'
        },
        {
          title: 'Data Usage',
          content: 'Your data is used solely for service delivery and improvement'
        },
        {
          title: 'Data Protection',
          content: 'Industry-standard encryption and security measures in place'
        },
        {
          title: 'Your Rights',
          content: 'Access, modify, or delete your personal data anytime'
        }
      ]
    }
  };

  const content = supportContent[title] || {
    hero: title,
    subtitle: description,
    sections: [
      { title: 'Information', content: description }
    ]
  };

  return (
    <div className="support-page">
      {/* Hero Section */}
      <section className="support-hero">
        <div className="support-hero-content">
          <div className="support-icon">
            <Icon />
          </div>
          <h1>{content.hero}</h1>
          <p>{content.subtitle}</p>
          <p className="support-description">{description}</p>
        </div>
      </section>

      {/* Contact Methods (for Help Desk) */}
      {content.contactMethods && (
        <section className="contact-methods">
          <div className="container">
            <h2>Contact Us</h2>
            <div className="contact-grid">
              {content.contactMethods.map((method, index) => (
                <div key={index} className="contact-card">
                  <method.icon className="contact-icon" />
                  <h3>{method.type}</h3>
                  <p>{method.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Common Issues (for Help Desk) */}
      {content.commonIssues && (
        <section className="common-issues">
          <div className="container">
            <h2>Common Issues We Handle</h2>
            <div className="issues-grid">
              {content.commonIssues.map((issue, index) => (
                <div key={index} className="issue-card">
                  <FaCheckCircle className="issue-icon" />
                  <span>{issue}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Baggage Allowances */}
      {content.allowances && (
        <section className="baggage-allowances">
          <div className="container">
            <h2>Baggage Allowances</h2>
            <div className="allowances-table">
              <div className="table-header">
                <span>Class</span>
                <span>Weight</span>
                <span>Pieces</span>
              </div>
              {content.allowances.map((allowance, index) => (
                <div key={index} className="table-row">
                  <span>{allowance.class}</span>
                  <span>{allowance.weight}</span>
                  <span>{allowance.pieces}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Restrictions */}
      {content.restrictions && (
        <section className="restrictions">
          <div className="container">
            <h2>Important Restrictions</h2>
            <div className="restrictions-list">
              {content.restrictions.map((restriction, index) => (
                <div key={index} className="restriction-item">
                  <FaClock className="restriction-icon" />
                  <span>{restriction}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Policy Sections */}
      {content.sections && (
        <section className="policy-sections">
          <div className="container">
            <h2>Policy Details</h2>
            <div className="policy-cards">
              {content.sections.map((section, index) => (
                <div key={index} className="policy-card">
                  <h3>{section.title}</h3>
                  <p>{section.content}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services Grid */}
      {content.services && (
        <section className="services-grid">
          <div className="container">
            <h2>Available Services</h2>
            <div className="services-list">
              {content.services.map((service, index) => (
                <div key={index} className="service-item">
                  <FaCheckCircle className="service-icon" />
                  <div>
                    <h4>{service.name}</h4>
                    <p>{service.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="support-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Need More Help?</h2>
            <p>Our support team is always ready to assist you</p>
            <Link to="/help-desk" className="cta-button">
              Contact Support
              <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export { SupportPage };
