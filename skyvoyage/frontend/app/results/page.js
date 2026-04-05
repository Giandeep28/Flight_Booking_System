"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import FlightCard from '../components/flights/FlightCard';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const res = await axios.post('http://localhost:5000/api/flights/search', {
          origin: searchParams.get('from'),
          destination: searchParams.get('to'),
          departure_date: searchParams.get('date'),
          tripType: searchParams.get('tripType')
        });
        setFlights(res.data.flights);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFlights();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#000814]">
      <Navbar />
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-[300px_1fr] gap-12">
        <aside className="glass-card p-10 h-fit sticky top-32 border-[rgba(255,255,255,0.05)]">
           <h3 className="font-black text-white text-lg mb-10 tracking-widest uppercase">Filters</h3>
           
           <div className="mb-10">
              <span className="text-[0.65rem] font-black uppercase text-[var(--text-muted)] tracking-widest block mb-6">Stops Count</span>
              <div className="space-y-4">
                 {['Non-Stop', '1+ Stop'].map(s => (
                   <label key={s} className="flex items-center gap-3 text-sm font-bold text-[var(--text-muted)] cursor-pointer hover:text-white transition-colors">
                      <input type="checkbox" className="w-4 h-4 accent-[var(--primary)]" />
                      {s}
                   </label>
                 ))}
              </div>
           </div>

           <div className="mb-10">
              <span className="text-[0.65rem] font-black uppercase text-[var(--text-muted)] tracking-widest block mb-6">Airlines</span>
              <div className="space-y-4">
                 {['IndiGo', 'Air India', 'Vistara', 'Emirates'].map(a => (
                   <label key={a} className="flex items-center gap-3 text-sm font-bold text-[var(--text-muted)] cursor-pointer hover:text-white transition-colors">
                      <input type="checkbox" className="w-4 h-4 accent-[var(--primary)]" />
                      {a}
                   </label>
                 ))}
              </div>
           </div>

           <div className="h-[1px] bg-[rgba(255,255,255,0.05)] mb-10"></div>
           <button className="text-[var(--primary)] text-xs font-black uppercase tracking-widest hover:text-white transition-colors">Reset All Filters</button>
        </aside>

        <main className="flex flex-col gap-6">
           <div className="glass-card px-10 py-6 border-[var(--primary)] border-opacity-20 bg-[rgba(197,160,89,0.05)]">
              <p className="font-extrabold text-sm text-[var(--primary)] tracking-widest uppercase">
                {loading ? 'Consulting Live Air Traffics...' : `${flights.length} Premium Flights Available`}
              </p>
           </div>

           {loading ? (
             <div className="space-y-6">
                {[1,2,3].map(i => (
                  <div key={i} className="glass-card h-[280px] animate-pulse bg-[rgba(255,255,255,0.02)]"></div>
                ))}
             </div>
           ) : (
             flights.map(f => <FlightCard key={f.id} flight={f} />)
           )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
