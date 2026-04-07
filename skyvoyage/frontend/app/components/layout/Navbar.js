"use client";
import React from 'react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="header sticky top-0 z-[1100] h-[80px] bg-white border-b border-[rgba(0,0,0,0.05)] shadow-sm text-[#000814]">
      <nav className="navbar container mx-auto px-6 h-full flex justify-between items-center relative z-[1000]">
        <Link href="/" className="flex items-center gap-3 text-2xl font-black tracking-widest text-[#000814]">
          <div className="w-[45px] h-[45px] bg-[var(--primary)] rounded-xl flex items-center justify-center text-2xl shadow-[var(--glow-gold)]">✈️</div>
          <span>SKYVOYAGE</span>
        </Link>
        
        <ul className="hidden md:flex gap-11 items-center h-full font-bold text-[0.85rem] uppercase tracking-wider text-[#1e293b]">
          <li className="group h-full flex items-center">
            <Link href="/" className="hover:text-[var(--primary)] transition-colors active">Flights</Link>
            {/* Mega Menu Simulation */}
            <div className="absolute top-[80px] left-[-400px] w-[1100px] bg-white text-dark shadow-2xl p-16 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border-t border-[var(--primary)]">
              <div className="grid grid-cols-4 gap-12">
                  <div className="space-y-6">
                    <h4 className="text-xs font-black uppercase tracking-[2.5px] text-slate-800">Flight Services</h4>
                    <ul className="space-y-4 text-slate-700 font-semibold normal-case text-base">
                      <li><Link href="/" className="hover:text-[var(--primary)] flex items-center gap-3"><i className="fas fa-plane-departure text-[var(--primary)]"></i> One-Way Flights</Link></li>
                      <li><Link href="/" className="hover:text-[var(--primary)] flex items-center gap-3"><i className="fas fa-sync-alt text-[var(--primary)]"></i> Round-Trip Flights</Link></li>
                      <li><Link href="/" className="hover:text-[var(--primary)] flex items-center gap-3"><i className="fas fa-random text-[var(--primary)]"></i> Multi-City Routes</Link></li>
                    </ul>
                  </div>
                  <div className="space-y-6">
                    <h4 className="text-xs font-black uppercase tracking-[2.5px] text-slate-800">Domestic Hubs</h4>
                    <ul className="space-y-4 text-slate-700 font-semibold normal-case text-base">
                      <li><Link href="/" className="hover:text-[var(--primary)] text-sm">DEL - Mumbai</Link></li>
                      <li><Link href="/" className="hover:text-[var(--primary)] text-sm">BLR - Delhi</Link></li>
                      <li><Link href="/" className="hover:text-[var(--primary)] text-sm">BOM - Goa</Link></li>
                    </ul>
                  </div>
                  <div className="bg-white p-8 rounded-2xl flex flex-col justify-center border border-slate-100">
                    <span className="text-[var(--primary)] font-black text-xs tracking-widest mb-2">SKYPRIORITY</span>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">Unlock premium lounge access and priority boarding with our loyalty tier.</p>
                    <button className="bg-[var(--primary)] text-white px-6 py-3 rounded-xl font-black text-xs tracking-widest hover:bg-black transition-colors">UPGRADE NOW</button>
                  </div>
              </div>
            </div>
          </li>
          <li><Link href="/dashboard" className="hover:text-[var(--primary)]">Booking Hub</Link></li>
          <li><Link href="/" className="hover:text-[var(--primary)]">Member Offers</Link></li>
          <li><Link href="/" className="hover:text-[var(--primary)]">Help Desk</Link></li>
        </ul>

        <button className="bg-[var(--primary)] text-dark px-10 py-3 rounded-xl font-extrabold text-[0.85rem] tracking-wider hover:bg-white transition-all transform hover:-translate-y-1">
          SIGN IN
        </button>
      </nav>
    </header>
  );
}
