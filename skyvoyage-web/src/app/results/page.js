'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const ResultsPage = () => {
  const searchParams = useSearchParams();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    stops: [],
    airline: []
  });

  const from = searchParams.get('from') || 'DEL';
  const to = searchParams.get('to') || 'BOM';

  useEffect(() => {
    // Simulate flight search delay
    const timer = setTimeout(async () => {
      try {
        // Mock flight data generator
        const mockAirlines = [
          { code: 'AI', name: 'Air India', logo: 'https://www.gstatic.com/flights/airline_logos/70px/AI.png' },
          { code: '6E', name: 'IndiGo', logo: 'https://www.gstatic.com/flights/airline_logos/70px/6E.png' },
          { code: 'UK', name: 'Vistara', logo: 'https://www.gstatic.com/flights/airline_logos/70px/UK.png' },
          { code: 'EK', name: 'Emirates', logo: 'https://www.gstatic.com/flights/airline_logos/70px/EK.png' }
        ];

        const generatedFlights = Array.from({ length: 6 }).map((_, i) => ({
          id: `FL${1000 + i}`,
          airline: mockAirlines[i % mockAirlines.length],
          departure: `${10 + i}:15`,
          arrival: `${13 + i}:45`,
          duration: `${3 + i}h 30m`,
          price: 3500 + Math.floor(Math.random() * 12000),
          stops: i % 2 === 0 ? 'Non-Stop' : '1 Stop'
        }));

        setFlights(generatedFlights);
        setLoading(false);
      } catch (error) {
        console.error("Flight search failed:", error);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-[1280px] mx-auto px-5 py-12 grid grid-cols-1 lg:grid-cols-[290px_1fr] gap-10 animate-fade-in">
      {/* Sidebar Filters */}
      <aside>
        <div className="glass-card p-10 sticky top-[110px]">
          <h3 className="font-black text-lg mb-10 tracking-widest uppercase italic text-[#C5A059]">Refine Journey</h3>
          
          <div className="mb-10">
            <span className="input-label">Stops Count</span>
            <div className="flex flex-col gap-4 mt-4">
              {['Non-Stop', '1 Stop', '2+ Stops'].map((stop) => (
                <label key={stop} className="flex items-center gap-3 text-[14px] font-bold text-[#94A3B8] cursor-pointer group">
                  <input type="checkbox" className="w-[18px] h-[18px] accent-[#C5A059]" />
                  <span className="group-hover:text-[#C5A059] transition-colors">{stop}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <span className="input-label">Airlines</span>
            <div className="flex flex-col gap-4 mt-4">
              {['Air India', 'IndiGo', 'Vistara', 'Emirates'].map((airline) => (
                <label key={airline} className="flex items-center gap-3 text-[14px] font-bold text-[#94A3B8] cursor-pointer group">
                  <input type="checkbox" className="w-[18px] h-[18px] accent-[#C5A059]" />
                  <span className="group-hover:text-[#C5A059] transition-colors">{airline}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Results List */}
      <div className="w-full">
        <div className="glass-card mb-8 px-12 py-6 flex justify-between items-center bg-[rgba(197,160,89,0.05)] border-[rgba(197,160,89,0.1)]">
          <div className="font-black text-lg text-[#C5A059] italic uppercase tracking-wider">
            {loading ? 'Finding Best Fares...' : `Best Fares from ${from} to ${to}`}
          </div>
          {!loading && (
            <div className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-widest bg-[rgba(255,255,255,0.03)] px-4 py-2 rounded-lg border border-[rgba(255,255,255,0.05)]">
              {flights.length} flights showing
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          {loading ? (
            // Skeleton Loaders
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass-card p-12 h-[180px] animate-pulse bg-[rgba(255,255,255,0.02)]" />
            ))
          ) : (
            flights.map((flight) => (
              <div key={flight.id} className="glass-card p-10 lg:p-12 grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1fr_1.5fr_1.5fr] items-center gap-8 md:gap-12 group hover:translate-x-1 outline outline-transparent hover:outline-[rgba(197,160,89,0.2)] transition-all duration-300">
                <div className="flex items-center gap-6">
                  <img src={flight.airline.logo} alt={flight.airline.name} className="h-12 w-12 object-contain filter grayscale group-hover:grayscale-0 transition-all" />
                  <span className="font-extrabold text-[#94A3B8] group-hover:text-white transition-colors">{flight.airline.name}</span>
                </div>
                
                <div className="text-center md:text-left">
                  <div className="font-black text-3xl mb-1">{flight.departure}</div>
                  <div className="text-[12px] font-black text-[#C5A059] uppercase tracking-widest">{from}</div>
                </div>

                <div className="text-center flex flex-col items-center">
                  <div className="text-[11px] font-bold text-[#94A3B8] mb-2">{flight.duration}</div>
                  <div className="w-[80px] h-[2px] bg-[rgba(255,255,255,0.1)] relative">
                    <div className="absolute top-[-3px] left-[50%] translate-x-[-50%] w-2 h-2 bg-[#C5A059] rounded-full shadow-[0_0_10px_#C5A059]" />
                  </div>
                  <div className="text-[10px] font-black text-[#C5A059] mt-2 uppercase tracking-tighter italic">{flight.stops}</div>
                </div>

                <div className="text-center md:text-right">
                  <div className="font-black text-3xl mb-1">{flight.arrival}</div>
                  <div className="text-[12px] font-black text-[#C5A059] uppercase tracking-widest">{to}</div>
                </div>

                <div className="text-center md:text-right flex flex-col items-center md:items-end gap-3">
                  <div className="text-4xl font-black text-[#C5A059] drop-shadow-[0_0_15px_rgba(197,160,89,0.2)]">₹{flight.price.toLocaleString()}</div>
                  <button className="btn-primary py-3 px-8 text-sm rounded-xl w-full">SELECT SEAT</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
