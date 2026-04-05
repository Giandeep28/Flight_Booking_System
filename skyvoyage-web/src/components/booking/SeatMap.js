'use client';

import React, { useState } from 'react';

const SeatMap = ({ onSelect }) => {
  const [selected, setSelected] = useState(null);

  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const columns = Array.from({ length: 15 }, (_, i) => i + 1);

  const handleSeatClick = (seatId) => {
    setSelected(seatId);
    onSelect(seatId);
  };

  return (
    <div className="flex flex-col items-center gap-12 bg-[rgba(5, 12, 25, 0.8)] p-12 rounded-[40px] border border-[rgba(255,255,255,0.05)] shadow-2xl relative overflow-hidden">
      <div className="absolute top-[-50px] left-0 w-full h-1 bg-[rgba(197, 160, 89, 0.5)] blur-2xl"></div>
      
      {/* Front of Plane */}
      <div className="w-[180px] h-[60px] bg-[rgba(255,255,255,0.02)] border-x-2 border-t-2 border-white/5 rounded-t-[80px] flex items-center justify-center relative shadow-[0_-20px_50px_rgba(197,160,89,0.05)]">
         <div className="text-[10px] font-black tracking-[4px] text-white/20 uppercase italic">Cockpit Section</div>
         <div className="absolute top-[-10px] left-[-30px] w-20 h-1 bg-white/5 rotate-[-45deg] blur-sm"></div>
         <div className="absolute top-[-10px] right-[-30px] w-20 h-1 bg-white/5 rotate-[45deg] blur-sm"></div>
      </div>

      <div className="grid grid-cols-[repeat(15,1fr)] gap-4 select-none">
        {columns.map((col) => (
          <div key={col} className="flex flex-col gap-4">
            {rows.map((row, idx) => {
              const seatId = `${col}${row}`;
              const isSelected = selected === seatId;
              const isAisle = idx === 3; // Gap after C
              
              return (
                <React.Fragment key={seatId}>
                  {isAisle && <div className="h-10 w-full flex items-center justify-center text-[9px] font-bold text-white/10 uppercase tracking-widest pointer-events-none rotate-90 my-2">Aisle</div>}
                  <div 
                    className={`group relative w-10 h-10 rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-center p-1 border-2 ${
                      isSelected 
                        ? 'bg-[#C5A059] border-[#C5A059] shadow-[0_0_20px_rgba(197,160,89,0.4)] scale-110 rotate-3' 
                        : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-[#C5A059]/30 hover:-translate-y-1'
                    }`}
                    onClick={() => handleSeatClick(seatId)}
                  >
                    <div className={`w-full h-full rounded-lg border flex items-center justify-center text-[10px] font-black ${
                      isSelected ? 'border-[#000814]/20 text-[#000814]' : 'border-white/10 text-white/40'
                    }`}>
                      {seatId}
                    </div>
                    
                    {/* Hover Effect Toolkit */}
                    {!isSelected && (
                      <div className="absolute bottom-[-45px] left-1/2 -translate-x-1/2 bg-white text-[#000814] px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-2xl pointer-events-none">
                         ₹15,499 • SELECT
                      </div>
                    )}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex gap-12 mt-4">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-md bg-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.3)] border border-[#C5A059]"></div>
          <span className="text-[11px] font-black uppercase text-white/60 tracking-widest">Selected Seat</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-md bg-white/5 border border-white/10"></div>
          <span className="text-[11px] font-black uppercase text-white/60 tracking-widest">Available Selection</span>
        </div>
        <div className="flex items-center gap-3 opacity-30">
          <div className="w-5 h-5 rounded-md bg-[rgba(255,0,50,0.1)] border border-[rgba(255,0,50,0.2)] flex items-center justify-center text-[8px] text-[rgba(255,0,50,0.5)]">X</div>
          <span className="text-[11px] font-black uppercase text-white/60 tracking-widest">Occupied Seat</span>
        </div>
      </div>
    </div>
  );
};

export default SeatMap;
