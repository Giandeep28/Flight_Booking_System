import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{ background: '#01040a', padding: '6rem 0 3rem', borderTop: '1px solid var(--border)', marginTop: '4rem' }}>
            <div className="container footer-grid">
                <div className="footer-col">
                    <Link to="/" className="logo" style={{ marginBottom: '2rem', display: 'flex' }}>
                        <div className="logo-icon">
                            <Plane size={24} color="var(--dark)" strokeWidth={3} />
                        </div>
                        <span style={{ fontSize: '1.8rem', marginLeft: '12px', fontWeight: 950, letterSpacing: '2px' }}>SKYVOYAGE</span>
                    </Link>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '2rem' }}>
                        Redefining the art of air travel with premium comfort and global connectivity. Fly the skies with elegance.
                    </p>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <a href="#" className="social-icon"><Facebook size={20} /></a>
                        <a href="#" className="social-icon"><Twitter size={20} /></a>
                        <a href="#" className="social-icon"><Instagram size={20} /></a>
                        <a href="#" className="social-icon"><Linkedin size={20} /></a>
                    </div>
                </div>

                <div className="footer-col">
                    <h4>FLIGHT SERVICES</h4>
                    <ul className="footer-links">
                        <li><Link to="/flights/international">International Routes</Link></li>
                        <li><Link to="/flights/domestic">Domestic Hubs</Link></li>
                        <li><Link to="/flights/status">Flight Status</Link></li>
                        <li><Link to="/flights/check-in">Online Check-In</Link></li>
                        <li><Link to="/flights/cargo">Cargo Services</Link></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>SUPPORT & HELP</h4>
                    <ul className="footer-links">
                        <li><Link to="/support/help-desk">Help Desk</Link></li>
                        <li><Link to="/support/baggage">Baggage Info</Link></li>
                        <li><Link to="/support/refund">Refund Policy</Link></li>
                        <li><Link to="/support/assistance">Special Assistance</Link></li>
                        <li><Link to="/support/privacy">Privacy Policy</Link></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>SKY NEWSLETTER</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                        Join our elite list for early bird offers and member-only news.
                    </p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input 
                            type="email" 
                            placeholder="Email" 
                            style={{ 
                                flex: 1, 
                                background: 'rgba(255,255,255,0.04)', 
                                border: '1px solid var(--glass-border)', 
                                padding: '1rem', 
                                borderRadius: '10px', 
                                color: 'white' 
                            }} 
                        />
                        <button className="btn btn-primary" style={{ padding: '0.7rem 1.2rem', borderRadius: '10px' }}>
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
            <div className="container" style={{ paddingTop: '3rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
                    © 2026 SKYVOYAGE AIRLINES. ALL RIGHTS RESERVED. DESIGNED FOR EXCELLENCE.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
