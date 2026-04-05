"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import axios from 'axios';

export default function DashboardPage() {
  const [bookings, setBookings] = useState([
    { pnr: 'SKY9928', flight: '6E-203', origin: 'DEL', dest: 'BOM', date: '24 APR 2026', status: 'Confirmed' }
  ]);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-[#000814]">
      <Navbar />
      <div className="container mx-auto px-6 py-20 max-w-[1200px]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
          <div>
            <span className="bg-[rgba(16,185,129,0.1)] text-[#10B981] px-4 py-1 rounded text-[0.65rem] font-black uppercase tracking-widest mb-4 block w-fit">SkyRewards Member</span>
            <h1 className="text-white text-5xl font-black tracking-tight uppercase">Your Travel Hub</h1>
          </div>
          <div className="flex gap-4">
             <div className="glass-card px-8 py-4 text-center border-l-4 border-l-[var(--primary)] bg-[rgba(197,160,89,0.05)]">
                <div className="text-[var(--text-muted)] text-[0.65rem] font-black uppercase tracking-[2px] mb-1">Loyalty Points</div>
                <div className="text-white text-2xl font-black">2,450 <span className="text-[var(--primary)] text-sm">PTS</span></div>
             </div>
             <div className="glass-card px-8 py-4 text-center border-l-4 border-l-[#10B981] bg-[rgba(16,185,129,0.05)]">
                <div className="text-[var(--text-muted)] text-[0.65rem] font-black uppercase tracking-[2px] mb-1">Tier Status</div>
                <div className="text-white text-2xl font-black uppercase">Gold Elite</div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12">
           <div className="space-y-8">
              <h3 className="font-black text-white text-lg tracking-widest uppercase border-b border-[rgba(255,255,255,0.05)] pb-6 mb-10">Active Bookings</h3>
              {bookings.map((b, i) => (
                <div key={i} className="glass-card p-10 flex flex-col md:flex-row justify-between items-center gap-10 hover:bg-[rgba(255,255,255,0.03)] transition-all">
                   <div className="flex items-center gap-8">
                      <div className="w-16 h-16 bg-[rgba(255,255,255,0.03)] rounded-2xl flex items-center justify-center text-[var(--primary)] text-2xl border border-[rgba(255,255,255,0.05)]">
                        <i className="fas fa-plane-departure"></i>
                      </div>
                      <div>
                        <div className="text-white font-black text-xl mb-1">{b.origin} → {b.dest}</div>
                        <div className="text-[var(--text-muted)] text-xs font-bold tracking-widest uppercase">{b.date} • {b.flight}</div>
                      </div>
                   </div>
                   <div className="text-center md:text-right">
                      <div className="text-[0.65rem] font-black text-[var(--text-muted)] mb-2 tracking-widest uppercase">Booking PNR</div>
                      <div className="text-[var(--primary)] text-2xl font-black tracking-[4px]">{b.pnr}</div>
                   </div>
                   <div>
                      <span className="bg-[rgba(16,185,129,0.1)] text-[#10B981] px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-[rgba(16,185,129,0.2)]">Confirmed</span>
                   </div>
                   <button className="px-8 py-3 border border-[rgba(255,255,255,0.1)] rounded-xl text-[0.65rem] font-black uppercase tracking-widest text-white hover:bg-white hover:text-dark transition-all">View Ticket</button>
                </div>
              ))}
           </div>

           <aside className="space-y-8">
              <div className="glass-card p-10 bg-[var(--primary)] text-dark">
                 <h4 className="font-black text-xs tracking-widest uppercase mb-6">SkyPriority Special</h4>
                 <p className="font-bold text-lg leading-relaxed mb-8">Access Premium Lounges at Delhi & Mumbai Hubs.</p>
                 <button className="bg-dark text-white w-full py-4 rounded-xl font-black text-[0.7rem] tracking-widest uppercase hover:bg-white hover:text-dark transition-all">GET ACCESS KEY</button>
              </div>

              <div className="glass-card p-10">
                 <h4 className="text-white font-black text-xs tracking-widest uppercase mb-8">Quick Support</h4>
                 <div className="space-y-4">
                    <button className="w-full text-left p-4 bg-[rgba(255,255,255,0.03)] rounded-xl text-sm font-bold text-[var(--text-muted)] hover:bg-[rgba(255,255,255,0.05)] transition-all flex items-center justify-between">
                       RESCHEDULE FLIGHT <i className="fas fa-chevron-right text-[var(--primary)] text-[0.65rem]"></i>
                    </button>
                    <button className="w-full text-left p-4 bg-[rgba(255,255,255,0.03)] rounded-xl text-sm font-bold text-[var(--text-muted)] hover:bg-[rgba(255,255,255,0.05)] transition-all flex items-center justify-between">
                       CANCEL BOOKING <i className="fas fa-chevron-right text-[var(--primary)] text-[0.65rem]"></i>
                    </button>
                    <button className="w-full text-left p-4 bg-[rgba(255,255,255,0.03)] rounded-xl text-sm font-bold text-[var(--text-muted)] hover:bg-[rgba(255,255,255,0.05)] transition-all flex items-center justify-between">
                       ADD EXTRA BAGGAGE <i className="fas fa-chevron-right text-[var(--primary)] text-[0.65rem]"></i>
                    </button>
                 </div>
              </div>
           </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}
