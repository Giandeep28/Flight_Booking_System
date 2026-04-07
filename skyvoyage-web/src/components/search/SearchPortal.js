"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AirportAutocomplete from "./AirportAutocomplete";

export default function SearchPortal() {
  const router = useRouter();
  const [tripType, setTripType] = useState("oneway");
  const [travelers, setTravelers] = useState("1");

  const handleSearch = () => {
    const from = document.querySelector('input[placeholder="Enter City/Airport"]')?.value || "";
    const to = document.querySelectorAll('input[placeholder="Enter City/Airport"]')[1]?.value || "";
    const date = document.querySelector('input[type="date"]')?.value || "";
    
    const params = new URLSearchParams({
      from: from.split("(")[1]?.replace(")", "") || "",
      to: to.split("(")[1]?.replace(")", "") || "",
      date: date || new Date().toISOString().split("T")[0],
      adults: travelers
    });
    
    router.push(`/results?${params.toString()}`);
  };

  return (
    <div className="container relative z-10 w-full mt-16 px-0 mb-32">
      <div className="bg-white border border-black/5 p-8 md:p-10 lg:p-12 shadow-2xl rounded-3xl">
        <div className="flex gap-12 mb-10 border-b border-black/5 pb-5 overflow-x-auto no-scrollbar">
          {[
            { id: "oneway", label: "ONE WAY" },
            { id: "round", label: "ROUND TRIP" },
            { id: "multi", label: "MULTI CITY" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTripType(tab.id)}
              className={`text-sm font-semibold tracking-wider transition-all duration-300 pb-2 border-b-2 hover:text-primary ${
                tripType === tab.id 
                  ? "text-primary border-primary font-black" 
                  : "text-text-muted border-transparent"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 transition-all duration-500">
          <div className="flex-1 relative">
            <span className="input-label">Departure From</span>
            <AirportAutocomplete placeholder="Enter City/Airport" />
          </div>
          <div className="flex-1 relative">
            <span className="input-label">Destination To</span>
            <AirportAutocomplete placeholder="Enter City/Airport" />
          </div>
          <div className="flex-1">
            <span className="input-label">Travel Date</span>
            <input 
              type="date" 
              className="input-field bg-[#f8fafc] border border-[#e2e8f0] p-5 rounded-2xl w-full text-[#000814] font-bold text-[1.15rem] outline-none hover:border-primary/50 transition-colors" 
            />
          </div>
          <div className="flex-1">
            <span className="input-label">Travelers & Class</span>
            <select 
              value={travelers}
              onChange={(e) => setTravelers(e.target.value)}
              className="input-field bg-[#f8fafc] border border-[#e2e8f0] p-5 rounded-2xl w-full text-[#000814] font-bold text-[1.15rem] outline-none hover:border-primary/50 appearance-none transition-colors"
            >
              <option value="1">1 Adult, Economy</option>
              <option value="2">2 Adults, Economy</option>
              <option value="1B">1 Adult, Business</option>
              <option value="1F">1 Adult, First</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex gap-10 overflow-x-auto no-scrollbar w-full md:w-auto">
            {['Special Student Fares', 'Armed Forces', 'Senior Citizen'].map((label) => (
              <label key={label} className="flex items-center gap-3 text-[0.85rem] font-bold cursor-pointer text-text-muted hover:text-primary transition-colors shrink-0">
                <input 
                  type="checkbox" 
                  className="w-[18px] h-[18px] accent-primary"
                /> 
                {label}
              </label>
            ))}
          </div>
          <button 
            onClick={handleSearch}
            className="btn btn-primary px-20 py-6 text-xl w-full md:w-auto shadow-glow-gold hover:shadow-primary/40 focus:scale-[0.98] active:scale-[0.95]"
          >
            SEARCH FLIGHTS
          </button>
        </div>
      </div>

      <style jsx>{`
        .input-label {
          font-size: 0.65rem;
          font-weight: 900;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 8px;
          letter-spacing: 1px;
          display: block;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
