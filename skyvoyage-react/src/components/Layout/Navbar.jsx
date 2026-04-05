import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Plane, ChevronDown, UserCircle } from 'lucide-react';

const Navbar = () => {
    return (
        <header>
            <nav className="container">
                <Link to="/" className="logo">
                    <div className="logo-icon">
                        <Plane size={28} color="var(--dark)" strokeWidth={3} />
                    </div>
                    <span>SKYVOYAGE</span>
                </Link>

                <ul className="nav-links">
                    <li className="nav-item">
                        <NavLink to="/flights" className={({ isActive }) => isActive ? "active" : ""}>
                            Flights <ChevronDown size={14} style={{ marginLeft: '5px' }} />
                        </NavLink>
                        <div className="mega-menu">
                            <div className="mega-grid">
                                <div className="mega-col">
                                    <h4>Flight Services</h4>
                                    <ul className="mega-links">
                                        <li><Link to="/flights/status"><Plane size={16} /> Flight Status</Link></li>
                                        <li><Link to="/flights/check-in"><UserCheck size={16} /> Online Check-In</Link></li>
                                        <li><Link to="/flights/cargo"><ChevronDown size={16} /> Cargo Services</Link></li>
                                    </ul>
                                </div>
                                <div className="mega-col">
                                    <h4>Domestic Routes</h4>
                                    <ul className="mega-links">
                                        <li><Link to="/flights/domestic">Delhi to Mumbai</Link></li>
                                        <li><Link to="/flights/domestic">Bengaluru to Delhi</Link></li>
                                        <li><Link to="/flights/domestic">Mumbai to Goa</Link></li>
                                    </ul>
                                </div>
                                <div className="mega-col">
                                    <h4>International Hubs</h4>
                                    <ul className="mega-links">
                                        <li><Link to="/flights/international">London Heathrow</Link></li>
                                        <li><Link to="/flights/international">Dubai International</Link></li>
                                        <li><Link to="/flights/international">Singapore Changi</Link></li>
                                    </ul>
                                </div>
                                <div className="mega-col" style={{ background: 'rgba(197, 160, 89, 0.05)', padding: '2.5rem', borderRadius: '16px' }}>
                                    <h4>SKYPRIORITY</h4>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                                        Unlock premium lounge access and priority boarding with our loyalty tier.
                                    </p>
                                    <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                        UPGRADE NOW
                                    </button>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li className="nav-item">
                        <a href="#">Booking Hub <ChevronDown size={14} style={{ marginLeft: '5px' }} /></a>
                        <div className="mega-menu">
                            <div className="mega-grid">
                                <div className="mega-col">
                                    <h4>Manage Travel</h4>
                                    <ul className="mega-links">
                                        <li><Link to="/flights/check-in">Check Booking PNR</Link></li>
                                        <li><Link to="/flights/check-in">Online Check-In</Link></li>
                                        <li><Link to="/support/refund">Refund Status</Link></li>
                                    </ul>
                                </div>
                                <div className="mega-col">
                                    <h4>Service Requests</h4>
                                    <ul className="mega-links">
                                        <li><Link to="/support/help-desk">Meal Preferences</Link></li>
                                        <li><Link to="/support/assistance">Special Assistance</Link></li>
                                        <li><Link to="/support/baggage">Add Baggage</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li className="nav-item">
                        <a href="#">Member Offers <ChevronDown size={14} style={{ marginLeft: '5px' }} /></a>
                    </li>
                    <li><NavLink to="/support/help-desk">Help Desk</NavLink></li>
                </ul>

                <div className="nav-actions">
                    <button className="btn btn-primary" style={{ padding: '0.7rem 2rem' }}>
                        SIGN IN
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
