"use client";
import React from 'react';

export default function FlightCard({ flight }) {
  return (
    <div className="glass-card p-10 md:p-14 grid grid-cols-1 md:grid-cols-5 items-center gap-12 group hover:bg-[rgba(255,255,255,0.05)] transition-all">
      <div className="flex items-center gap-6">
        <img src={flight.airline_logo} className="h-12 w-12 object-contain filter brightness-125" alt={flight.airline} />
        <div className="flex flex-col">
           <span className="font-black text-lg text-white mb-1 uppercase tracking-tight">{flight.airline}</span>
           <span className="text-[0.65rem] font-bold text-[var(--text-muted)] tracking-widest">{flight.flight_number}</span>
        </div>
      </div>
      
      <div className="text-center md:text-left">
        <div className="text-3xl font-black text-white mb-2">{flight.departure.time}</div>
        <div className="text-xs font-black text-[var(--text-muted)] tracking-widest uppercase">{flight.departure.airport}</div>
      </div>

      <div className="flex flex-col items-center">
        <div className="text-[0.7rem] font-bold text-[var(--text-muted)] mb-3 tracking-widest uppercase">{flight.duration}</div>
        <div className="w-20 h-[2px] bg-[rgba(255,255,255,0.1)] relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[var(--primary)] rounded-full shadow-[0_0_10px_var(--primary)]"></div>
        </div>
        <div className="text-[0.65rem] font-black text-[var(--primary)] mt-3 tracking-widest uppercase">{flight.stops === 0 ? 'NON-STOP' : `${flight.stops} STOP`}</div>
      </div>

      <div className="text-center md:text-right">
        <div className="text-3xl font-black text-white mb-2">{flight.arrival.time}</div>
        <div className="text-xs font-black text-[var(--text-muted)] tracking-widest uppercase">{flight.arrival.airport}</div>
      </div>

      <div className="text-center md:text-right">
        <div className="text-4xl font-black text-[var(--primary)] mb-6">
          {flight.currency} {flight.price.toLocaleString()}
        </div>
        <button 
          onClick={() => {
            sessionStorage.setItem('selectedFlight', JSON.stringify(flight));
            window.location.href = '/booking';
          }}
          className="bg-[var(--primary)] text-dark w-full py-4 rounded-2xl font-black text-[0.9rem] tracking-wider transition-all hover:bg-white hover:scale-105 active:scale-95 shadow-[0_10px_20px_rgba(197,160,89,0.2)]"
        >
          SECURE SEAT
        </button>
      </div>
    </div>
  );
}
