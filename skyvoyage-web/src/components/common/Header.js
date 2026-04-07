'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, login } = useAuth();
  const [activeMenu, setActiveMenu] = useState(null);

  const handleMenuEnter = (menu) => setActiveMenu(menu);
  const handleMenuLeave = () => setActiveMenu(null);

  return (
    <header className="header bg-white border-b border-[rgba(0,0,0,0.05)] sticky top-0 z-[1100] h-[80px] shadow-sm">
      <nav className="navbar max-w-[1280px] mx-auto px-5 flex justify-between items-center h-full relative z-[1000]">
        <Link href="/" className="flex items-center gap-3 text-2xl font-black text-[#000814] no-underline tracking-[1.5px]">
          <div className="w-[45px] height-[45px] bg-[#C5A059] rounded-xl flex items-center justify-center text-2xl shadow-[0_0_25px_rgba(197,160,89,0.25)]">
            ✈️
          </div>
          <span>SKYVOYAGE</span>
        </Link>
        
        <ul className="flex gap-11 list-none h-full items-center">
          <li 
            className="h-full flex items-center group nav-item"
            onMouseEnter={() => handleMenuEnter('flights')}
            onMouseLeave={handleMenuLeave}
          >
            <a href="#" className="text-[#1e293b] font-bold text-[13px] uppercase tracking-wider transition-colors hover:text-[#C5A059]">
              Flights <i className="fas fa-chevron-down text-[10px] ml-1"></i>
            </a>
            
            <div className={`mega-menu ${activeMenu === 'flights' ? 'opacity-100 visible translate-y-0' : ''}`}>
              <div className="grid grid-cols-4 gap-12 max-w-[1200px] mx-auto">
                <div className="flex flex-col gap-7">
                  <h4 className="text-[12px] uppercase tracking-[2.5px] text-[#1f2937] font-black italic">Flight Services</h4>
                  <ul className="list-none flex flex-col gap-3">
                    <li><a href="#" className="mega-link"><i className="fas fa-plane-departure text-[#C5A059] mr-2"></i> One-Way Flights</a></li>
                    <li><a href="#" className="mega-link"><i className="fas fa-sync-alt text-[#C5A059] mr-2"></i> Round-Trip Flights</a></li>
                    <li><a href="#" className="mega-link"><i className="fas fa-random text-[#C5A059] mr-2"></i> Multi-City Routes</a></li>
                    <li><a href="#" className="mega-link"><i className="fas fa-users-viewfinder text-[#C5A059] mr-2"></i> Charter Special</a></li>
                  </ul>
                </div>
                <div className="flex flex-col gap-7">
                  <h4 className="text-[12px] uppercase tracking-[2.5px] text-[#1f2937] font-black italic">Domestic Routes</h4>
                  <ul className="list-none flex flex-col gap-3">
                    <li><a href="#" className="mega-link"><i className="fas fa-city text-[#C5A059] mr-2"></i> Delhi to Mumbai</a></li>
                    <li><a href="#" className="mega-link"><i className="fas fa-city text-[#C5A059] mr-2"></i> Bengaluru to Delhi</a></li>
                    <li><a href="#" className="mega-link"><i className="fas fa-city text-[#C5A059] mr-2"></i> Mumbai to Goa</a></li>
                    <li><a href="#" className="mega-link"><i className="fas fa-city text-[#C5A059] mr-2"></i> Chennai to Kolkata</a></li>
                  </ul>
                </div>
                <div className="flex flex-col gap-7">
                  <h4 className="text-[12px] uppercase tracking-[2.5px] text-[#1f2937] font-black italic">International Hubs</h4>
                  <ul className="list-none flex flex-col gap-3">
                    <li><a href="#" className="mega-link"><i className="fas fa-globe text-[#C5A059] mr-2"></i> London Heathrow</a></li>
                    <li><a href="#" className="mega-link"><i className="fas fa-globe text-[#C5A059] mr-2"></i> Dubai International</a></li>
                    <li><a href="#" className="mega-link"><i className="fas fa-globe text-[#C5A059] mr-2"></i> Singapore Changi</a></li>
                    <li><a href="#" className="mega-link"><i className="fas fa-globe text-[#C5A059] mr-2"></i> New York JFK</a></li>
                  </ul>
                </div>
                <div className="bg-white p-8 rounded-2xl border border-[rgba(197,160,89,0.1)] flex flex-col justify-center text-center">
                  <h4 className="text-[12px] uppercase tracking-[2.5px] font-black italic text-[#C5A059] mb-4">SKYPRIORITY CARD</h4>
                  <p className="text-[13px] text-[#1e293b] mb-6 font-medium leading-relaxed">Unlock premium lounge access and priority boarding with our loyalty tier.</p>
                  <button className="btn-primary py-3 px-6 rounded-xl text-[12px]">UPGRADE NOW</button>
                </div>
              </div>
            </div>
          </li>
          <li><Link href="/booking-hub" className="nav-link">Booking Hub</Link></li>
          <li><Link href="/offers" className="nav-link">Member Offers</Link></li>
          <li><Link href="/help" className="nav-link">Help Desk</Link></li>
        </ul>

        <div className="flex items-center gap-4">
          {user ? (
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="text-right">
                <div className="text-[11px] font-black text-[#C5A059] uppercase tracking-tighter">SkyPriority</div>
                <div className="text-[14px] font-bold text-[#000814]">{user.name}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white border border-black/10 flex items-center justify-center text-[#1e293b] ring-2 ring-transparent group-hover:ring-[#C5A059] transition-all">
                <i className="fas fa-user-circle text-lg"></i>
              </div>
            </Link>
          ) : (
            <button 
              className="btn-primary py-2 px-8 rounded-xl text-[13px]" 
              onClick={() => login('demo@skyvoyage.com', 'password')}
            >
              SIGN IN
            </button>
          )}
        </div>
      </nav>

      <style jsx>{`
        .nav-link {
          @apply text-[#1e293b] font-bold text-[13px] uppercase tracking-wider transition-colors hover:text-[#C5A059] no-underline;
        }
        .mega-link {
          @apply flex items-center gap-3 text-[#1e293b] font-semibold text-[14px] p-3 rounded-lg hover:bg-[rgba(197,160,89,0.1)] hover:text-[#C5A059] hover:translate-x-2 transition-all duration-300 no-underline italic;
        }
      `}</style>
    </header>
  );
};

export default Header;
