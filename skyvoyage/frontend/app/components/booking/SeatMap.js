"use client";
import React, { useState } from 'react';

const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
const cols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function SeatMap({ onSelect }) {
  const [selectedSeat, setSelectedSeat] = useState(null);

  const toggleSeat = (id) => {
    setSelectedSeat(id);
    onSelect(id);
  };

  return (
    <div className="glass-card p-12 flex flex-col items-center bg-[rgba(5,13,28,0.9)]">
      <div className="w-[300px] h-10 bg-[var(--border)] rounded-t-[50px] mb-12 flex items-center justify-center font-black text-[0.65rem] tracking-widest uppercase text-[var(--text-muted)] border-b border-[rgba(255,255,255,0.05)]">
        Flight Nose / Cockpit
      </div>
      
      <div className="grid grid-cols-7 gap-4">
        {cols.map(c => (
          <React.Fragment key={c}>
            {rows.map((r, i) => (
              <React.Fragment key={r+c}>
                {i === 3 && <div className="w-8 h-8 flex items-center justify-center text-[var(--text-muted)] font-black text-[0.65rem]">{c}</div>}
                <div 
                  onClick={() => toggleSeat(r+c)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-[0.65rem] font-black cursor-pointer transition-all border
                    ${selectedSeat === r+c ? 'bg-[var(--primary)] text-dark border-[var(--primary)] scale-110 shadow-[0_0_15px_var(--primary)]' : 'bg-transparent text-[var(--text-muted)] border-[rgba(255,255,255,0.1)] hover:border-[var(--primary)]'}
                  `}
                >
                  {r}{c}
                </div>
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
      </div>

      <div className="mt-16 flex gap-10">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded bg-transparent border border-[rgba(255,255,255,0.1)]"></div>
          <span className="text-[0.65rem] font-black text-[var(--text-muted)] uppercase tracking-widest">Available</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded bg-[var(--primary)]"></div>
          <span className="text-[0.65rem] font-black text-white uppercase tracking-widest">Selected</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded bg-[rgba(255,255,255,0.05)] border border-transparent"></div>
          <span className="text-[0.65rem] font-black text-[rgba(255,255,255,0.2)] uppercase tracking-widest">Occupied</span>
        </div>
      </div>
    </div>
  );
}
