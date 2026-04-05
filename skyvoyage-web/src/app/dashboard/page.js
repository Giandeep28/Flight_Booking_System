'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const DashboardPage = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Mock booking data
    const mockBookings = [
      {
        pnr: 'SKY9982',
        from: 'DEL',
        to: 'BOM',
        date: '2026-04-10',
        time: '10:15',
        status: 'Confirmed',
        airline: 'Air India',
        seat: '12A'
      },
      {
        pnr: 'SKY1234',
        from: 'BOM',
        to: 'DXB',
        date: '2026-05-15',
        time: '23:45',
        status: 'Scheduled',
        airline: 'Emirates',
        seat: '45J'
      }
    ];
    setBookings(mockBookings);
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center text-white font-black text-4xl italic tracking-tighter">AUTHENTICATING...</div>;
  if (!user) return <div className="h-screen flex items-center justify-center text-white font-black text-2xl italic tracking-tighter uppercase tracking-widest text-[#C5A059]">ACCESS DENIED. PLEASE SIGN IN.</div>;

  return (
    <div className="max-w-[1280px] mx-auto px-5 py-12 animate-fade-in text-white">
      {/* Header Profile Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16 border-b border-white/5 pb-12">
        <div className="flex items-center gap-10">
          <div className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-[#C5A059] to-[#A48446] p-1 shadow-[0_20px_50px_rgba(197,160,89,0.3)]">
            <div className="w-full h-full rounded-[38px] bg-[#000814] flex items-center justify-center text-4xl">
               👤
            </div>
          </div>
          <div>
            <div className="text-[11px] font-black text-[#C5A059] uppercase tracking-[4px] mb-2 font-black italic">Loyalty Elite Member</div>
            <h1 className="text-5xl font-black italic tracking-tighter mb-4">{user.name.toUpperCase()}</h1>
            <div className="flex gap-4">
               <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[12px] font-bold text-[#94A3B8]">
                 <i className="fas fa-gem mr-2 text-[#C5A059]"></i> {user.tier}
               </div>
               <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[12px] font-bold text-[#C5A059]">
                 <i className="fas fa-star mr-2"></i> {user.points.toLocaleString()} Points
               </div>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
           <button className="btn-primary py-3 px-10 rounded-xl text-sm font-black italic uppercase tracking-widest">Manage Account</button>
           <button className="bg-white/5 border border-white/10 px-6 py-3 rounded-xl text-sm font-bold hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-500 transition-all uppercase tracking-widest">Sign Out</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12">
        <div>
          <div className="flex gap-10 border-b border-white/5 mb-10 pb-4">
             {['upcoming', 'completed', 'cancelled'].map(tab => (
               <button 
                 key={tab}
                 className={`text-[12px] font-black uppercase tracking-[3px] transition-all pb-2 border-b-2 ${
                   activeTab === tab ? 'text-[#C5A059] border-[#C5A059]' : 'text-[#334155] border-transparent'
                 }`}
                 onClick={() => setActiveTab(tab)}
               >
                 {tab}
               </button>
             ))}
          </div>

          <div className="flex flex-col gap-6">
            {bookings.map((booking) => (
              <div key={booking.pnr} className="glass-card hover:translate-x-1 outline outline-transparent hover:outline-[rgba(197,160,89,0.2)] transition-all p-10 lg:p-12 relative overflow-hidden group">
                <div className="absolute top-[-2px] left-0 w-32 h-[3px] bg-[#C5A059] animate-pulse"></div>
                <div className="flex justify-between items-start mb-10">
                   <div>
                      <div className="text-[11px] font-black text-[#C5A059] uppercase tracking-widest mb-1 italic">Booking Ref / PNR</div>
                      <div className="text-3xl font-black text-white italic tracking-tighter">{booking.pnr}</div>
                   </div>
                   <div className="text-right">
                      <div className="text-[11px] font-black text-emerald-400 uppercase tracking-widest mb-1">Status</div>
                      <div className="px-4 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[13px]">{booking.status}</div>
                   </div>
                </div>

                <div className="grid grid-cols-3 items-center gap-6 mb-10">
                   <div>
                      <div className="text-3xl font-black mb-1">{booking.from}</div>
                      <div className="text-[11px] font-bold text-[#94A3B8] uppercase">New Delhi Indira Gandhi</div>
                   </div>
                   <div className="flex flex-col items-center">
                      <i className="fas fa-plane text-[#C5A059] mb-3 text-lg opacity-40 group-hover:opacity-100 transition-opacity"></i>
                      <div className="w-full h-px bg-white/5 relative">
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#C5A059] rounded-full shadow-[0_0_10px_#C5A059]"></div>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-3xl font-black mb-1">{booking.to}</div>
                      <div className="text-[11px] font-bold text-[#94A3B8] uppercase">Mumbai International</div>
                   </div>
                </div>

                <div className="flex justify-between items-center bg-white/2 p-6 rounded-2xl border border-white/5">
                   <div className="flex gap-12">
                      <div>
                         <div className="text-[10px] font-black italic uppercase text-[#94A3B8] mb-1">Travel Date</div>
                         <div className="text-[14px] font-extrabold">{booking.date} • {booking.time}</div>
                      </div>
                      <div>
                         <div className="text-[10px] font-black italic uppercase text-[#94A3B8] mb-1">Assigned Seat</div>
                         <div className="text-[14px] font-extrabold text-[#C5A059]">{booking.seat}</div>
                      </div>
                   </div>
                   <button className="btn-primary py-2.5 px-8 text-[11px] rounded-lg">GENERATE TICKET</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Loyalty Progress Card */}
        <aside>
           <div className="glass-card p-10 bg-[rgba(197,160,89,0.03)] border-[rgba(197,160,89,0.1)] relative">
              <h3 className="text-lg font-black italic text-[#C5A059] uppercase tracking-widest mb-10">Next Tier Progress</h3>
              <div className="mb-10 text-center">
                 <div className="text-5xl font-black italic tracking-tighter mb-2">2,500 <span className="text-[16px] text-[#94A3B8] font-bold tracking-normal italic uppercase">Pts to go</span></div>
                 <div className="text-[11px] font-black uppercase text-[#334155] tracking-widest">Emerald Sky Status</div>
              </div>
              <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden mb-12">
                 <div className="w-[85%] h-full bg-[#C5A059] shadow-[0_0_20px_#C5A059]"></div>
              </div>
              <div className="flex flex-col gap-5">
                 <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#C5A059] border border-white/5 group-hover:border-[#C5A059]/30 transition-all"><i className="fas fa-couch"></i></div>
                    <span className="text-[13px] font-bold text-[#94A3B8]">Complimentary Upgrades</span>
                 </div>
                 <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#C5A059] border border-white/5 group-hover:border-[#C5A059]/30 transition-all"><i className="fas fa-coffee"></i></div>
                    <span className="text-[13px] font-bold text-[#94A3B8]">Lounge Access (150+ Hubs)</span>
                 </div>
                 <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#C5A059] border border-white/5 group-hover:border-[#C5A059]/30 transition-all"><i className="fas fa-shopping-bag"></i></div>
                    <span className="text-[13px] font-bold text-[#94A3B8]">Priority Baggage Handling</span>
                 </div>
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
};

export default DashboardPage;
