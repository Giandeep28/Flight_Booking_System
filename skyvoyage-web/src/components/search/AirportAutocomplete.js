'use client';

import React, { useState, useEffect, useRef } from 'react';

const AirportAutocomplete = ({ placeholder, onSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Debouncing logic
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 1) {
        try {
          // In production, this calls the FastAPI backend
          // const res = await fetch(`http://localhost:8000/api/airports/search?q=${query}`);
          // const data = await res.json();
          // setSuggestions(data);

          // Mock fallback for demonstration
          const mockAirports = [
            { code: 'DEL', city: 'Delhi', name: 'Indira Gandhi International', country: 'India' },
            { code: 'BOM', city: 'Mumbai', name: 'Chhatrapati Shivaji Maharaj', country: 'India' },
            { code: 'BLR', city: 'Bengaluru', name: 'Kempegowda International', country: 'India' },
            { code: 'DXB', city: 'Dubai', name: 'Dubai International', country: 'UAE' },
            { code: 'LHR', city: 'London', name: 'Heathrow Airport', country: 'UK' },
            { code: 'SIN', city: 'Singapore', name: 'Changi Airport', country: 'Singapore' },
            { code: 'JFK', city: 'New York', name: 'John F. Kennedy', country: 'USA' }
          ].filter(a => 
            a.city.toLowerCase().includes(query.toLowerCase()) || 
            a.code.toLowerCase().includes(query.toLowerCase())
          );
          setSuggestions(mockAirports);
          setIsOpen(true);
        } catch (error) {
          console.error("Failed to fetch airports:", error);
        }
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (airport) => {
    setQuery(`${airport.city} (${airport.code})`);
    setIsOpen(false);
    onSelect(airport.code);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <input 
        type="text" 
        className="input-field w-full" 
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length > 1 && setIsOpen(true)}
      />
      
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-[105%] left-0 right-0 bg-white border border-[rgba(0,0,0,0.05)] rounded-2xl max-h-[350px] overflow-y-auto z-[2000] shadow-[0_30px_60px_rgba(0,0,0,0.12)] animate-fade-in">
          {suggestions.map((airport) => (
            <div 
              key={airport.code} 
              className="p-5 border-b border-[rgba(0,0,0,0.03)] cursor-pointer transition-all hover:bg-[rgba(197,160,89,0.1)] hover:pl-8 flex justify-between items-center group"
              onClick={() => handleSelect(airport)}
            >
              <div>
                <div className="font-black text-lg text-[#000814] group-hover:text-[#C5A059] transition-colors">{airport.city} ({airport.code})</div>
                <div className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">{airport.name}</div>
              </div>
              <div className="text-[10px] text-[#C5A059] font-black uppercase tracking-widest">{airport.country}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AirportAutocomplete;
