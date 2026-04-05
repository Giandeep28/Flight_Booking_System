'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ChevronDown, Menu, X, User, LogOut } from 'lucide-react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    router.push('/');
  };

  const scrollHome = (sectionId) => {
    if (pathname !== '/') {
      router.push(`/#${sectionId}`);
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <header>
      <nav className="container">
        <Link href="/" className="logo">
          <img src="/logo.svg" alt="SkyVoyage" width="180" height="40" />
        </Link>

        <ul className="nav-links hidden lg:flex">
          <li className="nav-item">
            <span className={pathname === '/' ? 'active' : ''} style={{ cursor: 'default' }}>
              Flights
              <ChevronDown size={10} style={{ marginLeft: '5px' }} />
            </span>
            <div className="mega-menu">
              <div className="mega-grid">
                <div className="mega-col">
                  <h4>Flight Services</h4>
                  <ul className="mega-links">
                    <li>
                      <Link href="/">
                        <i className="fas fa-plane-departure" /> One-Way Flights
                      </Link>
                    </li>
                    <li>
                      <Link href="/">
                        <i className="fas fa-sync-alt" /> Round-Trip Flights
                      </Link>
                    </li>
                    <li>
                      <Link href="/">
                        <i className="fas fa-random" /> Multi-City Routes
                      </Link>
                    </li>
                    <li>
                      <Link href="/results">
                        <i className="fas fa-list" /> Search results
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="mega-col">
                  <h4>Domestic Routes</h4>
                  <ul className="mega-links">
                    <li>
                      <Link href="/">Delhi ↔ Mumbai</Link>
                    </li>
                    <li>
                      <Link href="/">Bengaluru ↔ Delhi</Link>
                    </li>
                    <li>
                      <Link href="/">Mumbai ↔ Goa</Link>
                    </li>
                    <li>
                      <Link href="/">Chennai ↔ Kolkata</Link>
                    </li>
                  </ul>
                </div>
                <div className="mega-col">
                  <h4>International Hubs</h4>
                  <ul className="mega-links">
                    <li>
                      <Link href="/">London (LHR)</Link>
                    </li>
                    <li>
                      <Link href="/">Dubai (DXB)</Link>
                    </li>
                    <li>
                      <Link href="/">Singapore (SIN)</Link>
                    </li>
                    <li>
                      <Link href="/">New York (JFK)</Link>
                    </li>
                  </ul>
                </div>
                <div
                  className="mega-col"
                  style={{
                    background: 'rgba(197, 160, 89, 0.05)',
                    padding: '2rem',
                    borderRadius: '16px',
                  }}
                >
                  <h4>SKYPRIORITY</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                    Lounge access and priority boarding with loyalty tiers.
                  </p>
                  <Link href="/dashboard" className="btn btn-primary" style={{ width: '100%', display: 'block', textAlign: 'center' }}>
                    DASHBOARD
                  </Link>
                </div>
              </div>
            </div>
          </li>
          <li className="nav-item">
            <span style={{ cursor: 'default' }}>
              Booking Hub
              <ChevronDown size={10} style={{ marginLeft: '5px' }} />
            </span>
            <div className="mega-menu">
              <div className="mega-grid">
                <div className="mega-col">
                  <h4>Manage Travel</h4>
                  <ul className="mega-links">
                    <li>
                      <Link href="/dashboard">
                        <i className="fas fa-search" /> PNR & bookings
                      </Link>
                    </li>
                    <li>
                      <Link href="/booking">
                        <i className="fas fa-ticket-alt" /> Continue booking
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard">
                        <i className="fas fa-plane-departure" /> Flight status
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="mega-col">
                  <h4>Service Requests</h4>
                  <ul className="mega-links">
                    <li>
                      <Link href="/booking">
                        <i className="fas fa-utensils" /> Meals & add-ons
                      </Link>
                    </li>
                    <li>
                      <Link href="/booking">
                        <i className="fas fa-suitcase" /> Baggage
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </li>
          <li className="nav-item">
            <span style={{ cursor: 'default' }}>
              Member Offers
              <ChevronDown size={10} style={{ marginLeft: '5px' }} />
            </span>
            <div className="mega-menu">
              <div className="mega-grid">
                <div className="mega-col">
                  <h4>Special Discounts</h4>
                  <ul className="mega-links">
                    <li>
                      <Link href="/" onClick={() => scrollHome('view-home')}>
                        <i className="fas fa-user-graduate" /> Student / Senior / Armed — select on search
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </li>
          <li>
            <Link href="/#faq" onClick={(e) => { e.preventDefault(); scrollHome('view-faq'); }}>
              Help Desk
            </Link>
          </li>
        </ul>

        <div className="nav-actions hidden lg:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="flex items-center gap-2 text-sm font-semibold hover:text-primary">
                <User size={18} />
                {user?.name || 'User'}
              </Link>
              <button type="button" onClick={handleLogout} className="btn btn-outline px-4 py-2 text-sm" title="Logout">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link href="/auth" className="btn btn-primary" style={{ padding: '0.7rem 2rem' }}>
              SIGN IN
            </Link>
          )}
        </div>

        <button
          type="button"
          className="lg:hidden text-text-muted hover:text-primary transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[80px] bg-dark/95 backdrop-blur-lg z-40">
          <div className="container py-6">
            <div className="flex flex-col space-y-6">
              <div className="border-b border-border pb-6">
                {isAuthenticated ? (
                  <div className="flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <User size={18} className="text-dark" />
                      </div>
                      <div>
                        <div className="font-semibold">{user?.name}</div>
                        <div className="text-sm text-text-muted">{user?.email}</div>
                      </div>
                    </Link>
                    <button type="button" onClick={handleLogout} className="text-text-muted hover:text-primary">
                      <LogOut size={20} />
                    </button>
                  </div>
                ) : (
                  <Link href="/auth" className="btn btn-primary w-full" onClick={() => setIsMobileMenuOpen(false)}>
                    SIGN IN
                  </Link>
                )}
              </div>

              <nav className="space-y-4">
                <Link href="/" className="block py-2 font-semibold text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                  Home search
                </Link>
                <Link href="/results" className="block py-2 text-text-muted" onClick={() => setIsMobileMenuOpen(false)}>
                  Results
                </Link>
                <Link href="/booking" className="block py-2 text-text-muted" onClick={() => setIsMobileMenuOpen(false)}>
                  Booking
                </Link>
                <Link href="/dashboard" className="block py-2 text-text-muted" onClick={() => setIsMobileMenuOpen(false)}>
                  Dashboard
                </Link>
              </nav>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
