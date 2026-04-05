"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function SearchPortal() {
  const router = useRouter();
  const [tripType, setTripType] = useState('oneway');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [airports, setAirports] = useState([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  useEffect(() => {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, []);

  const searchAirports = async (q, type) => {
    if (q.length < 2) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/airports?q=${q}`);
      setAirports(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = () => {
    if (!from || !to || !date) {
      alert("Please fill in all details");
      return;
    }
    const params = new URLSearchParams({ from, to, date, tripType });
    router.push(`/results?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-6 -mt-24 relative z-10 transition-all duration-700">
      <div className="search-portal">
        <div className="flex gap-12 mb-10 border-b border-[rgba(255,255,255,0.08)] pb-5 font-bold text-sm tracking-widest text-[var(--text-muted)]">
          {['oneway', 'round', 'multi'].map(type => (
            <button 
              key={type}
              onClick={() => setTripType(type)}
              className={`pb-4 border-b-2 transition-all ${tripType === type ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-transparent'}`}
            >
              {type.toUpperCase().replace('-', ' ')}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="relative">
            <label className="text-[0.65rem] font-black uppercase text-[var(--text-muted)] mb-3 block tracking-widest">Departure From</label>
            <input 
              type="text" 
              placeholder="City or Airport" 
              className="input-field"
              value={from}
              onChange={(e) => { setFrom(e.target.value); searchAirports(e.target.value); }}
              onFocus={() => setShowFromDropdown(true)}
              onBlur={() => setTimeout(() => setShowFromDropdown(false), 200)}
            />
            {showFromDropdown && airports.length > 0 && (
              <div className="absolute top-full left-0 w-full mt-2 bg-[#081225] border border-[var(--border)] rounded-2xl z-50 overflow-hidden shadow-2xl">
                {airports.map(a => (
                  <div key={a.code} onClick={() => setFrom(a.code)} className="p-4 hover:bg-[rgba(197,160,89,0.1)] cursor-pointer flex justify-between border-b border-[rgba(255,255,255,0.03)] last:border-0">
                    <span className="font-bold text-sm">{a.city}</span>
                    <span className="text-[var(--primary)] font-black text-xs">{a.code}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <label className="text-[0.65rem] font-black uppercase text-[var(--text-muted)] mb-3 block tracking-widest">Destination To</label>
            <input 
              type="text" 
              placeholder="City or Airport" 
              className="input-field" 
              value={to}
              onChange={(e) => { setTo(e.target.value); searchAirports(e.target.value); }}
              onFocus={() => setShowToDropdown(true)}
              onBlur={() => setTimeout(() => setShowToDropdown(false), 200)}
            />
            {showToDropdown && airports.length > 0 && (
               <div className="absolute top-full left-0 w-full mt-2 bg-[#081225] border border-[var(--border)] rounded-2xl z-50 overflow-hidden shadow-2xl">
                {airports.map(a => (
                  <div key={a.code} onClick={() => setTo(a.code)} className="p-4 hover:bg-[rgba(197,160,89,0.1)] cursor-pointer flex justify-between border-b border-[rgba(255,255,255,0.03)] last:border-0">
                    <span className="font-bold text-sm">{a.city}</span>
                    <span className="text-[var(--primary)] font-black text-xs">{a.code}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-[0.65rem] font-black uppercase text-[var(--text-muted)] mb-3 block tracking-widest">Travel Date</label>
            <input 
              type="date" 
              className="input-field" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <label className="text-[0.65rem] font-black uppercase text-[var(--text-muted)] mb-3 block tracking-widest">Travelers & Class</label>
            <select className="input-field">
              <option>1 Adult, Economy</option>
              <option>2 Adults, Economy</option>
              <option>1 Adult, Business</option>
              <option>1 Adult, First</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-10 flex-wrap">
            {['Student Fares', 'Armed Forces', 'Senior Citizen'].map(f => (
              <label key={f} className="flex items-center gap-3 text-[0.8rem] font-bold text-[var(--text-muted)] cursor-pointer hover:text-[var(--primary)] transition-colors">
                <input type="checkbox" className="w-4 h-4 accent-[var(--primary)] bg-transparent border-[rgba(255,255,255,0.1)]" />
                {f}
              </label>
            ))}
          </div>
          <button 
            onClick={handleSearch}
            className="btn-primary w-full md:w-auto px-16 h-16 text-lg hover:scale-105 active:scale-95 shadow-[0_15px_30px_rgba(197,160,89,0.2)]"
          >
            Search Flights
          </button>
        </div>
      </div>
    </div>
  );
}
