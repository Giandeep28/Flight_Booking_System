import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaPlane, FaGlobeAmericas, FaClock, FaTicketAlt, FaBox,
  FaHeadset, FaSuitcase, FaUndo, FaWheelchair, FaShieldAlt,
  FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn
} from 'react-icons/fa';

const Footer = () => {
  const flightServices = [
    { path: '/flights/international', icon: FaGlobeAmericas, label: 'International Routes' },
    { path: '/flights/domestic', icon: FaPlane, label: 'Domestic Routes' },
    { path: '/flights/status', icon: FaClock, label: 'Flight Status' },
    { path: '/flights/checkin', icon: FaTicketAlt, label: 'Check-In' },
    { path: '/flights/cargo', icon: FaBox, label: 'Cargo Services' }
  ];

  const supportServices = [
    { path: '/support/help-desk', icon: FaHeadset, label: 'Help Desk' },
    { path: '/support/baggage', icon: FaSuitcase, label: 'Baggage Info' },
    { path: '/support/refund', icon: FaUndo, label: 'Refund Policy' },
    { path: '/support/assistance', icon: FaWheelchair, label: 'Special Assistance' },
    { path: '/support/privacy', icon: FaShieldAlt, label: 'Privacy Policy' }
  ];

  const socialLinks = [
    { icon: FaFacebookF, label: 'Facebook' },
    { icon: FaTwitter, label: 'Twitter' },
    { icon: FaInstagram, label: 'Instagram' },
    { icon: FaLinkedinIn, label: 'LinkedIn' }
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-sections">
          {/* Company Info */}
          <div className="footer-section">
            <div className="footer-logo">
              <FaPlane className="footer-logo-icon" />
              <span>SKYVOYAGE</span>
            </div>
            <p className="footer-description">
              Your trusted partner for seamless travel experiences. 
              Connecting the world with comfort and reliability.
            </p>
            <div className="social-links">
              {socialLinks.map((social, index) => (
                <a key={index} href="#" className="social-link" aria-label={social.label}>
                  <social.icon />
                </a>
              ))}
            </div>
          </div>

          {/* Flight Services */}
          <div className="footer-section">
            <h3 className="footer-title">Flight Services</h3>
            <ul className="footer-links">
              {flightServices.map((service, index) => (
                <li key={index}>
                  <Link to={service.path} className="footer-link">
                    <service.icon className="link-icon" />
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Help */}
          <div className="footer-section">
            <h3 className="footer-title">Support & Help</h3>
            <ul className="footer-links">
              {supportServices.map((service, index) => (
                <li key={index}>
                  <Link to={service.path} className="footer-link">
                    <service.icon className="link-icon" />
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h3 className="footer-title">Contact Us</h3>
            <div className="contact-info">
              <div className="contact-item">
                <strong>24/7 Helpline:</strong>
                <span>1800-SKY-VOY</span>
              </div>
              <div className="contact-item">
                <strong>Email:</strong>
                <span>support@skyvoyage.com</span>
              </div>
              <div className="contact-item">
                <strong>Corporate Office:</strong>
                <span>Mumbai, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2026 SkyVoyage. All rights reserved.</p>
            <div className="footer-bottom-links">
              <Link to="/support/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/cookies">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
