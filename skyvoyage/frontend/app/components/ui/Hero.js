"use client";
import React, { useState, useEffect } from 'react';

const slides = [
  {
    tag: "Premium Flights",
    title: "ELEGANCE IN THE SKIES.",
    desc: "Experience the most luxurious cabin fleet in modern aviation. Book your dream destination today.",
    img: "https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&w=1600&q=82"
  },
  {
    tag: "Global Rewards",
    title: "BEYOND BOUNDARIES.",
    desc: "Connecting 150+ international hubs with seamless transfers and premium comfort.",
    img: "https://images.unsplash.com/photo-1542332213-9b5a5a3fab35?auto=format&fit=crop&w=1600&q=82"
  }
];

export default function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[650px] bg-[#020617] overflow-hidden">
      {slides.map((s, i) => (
        <div 
          key={i}
          className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out bg-cover bg-center ${active === i ? 'opacity-100' : 'opacity-0'}`}
          style={{ backgroundImage: `url('${s.img}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(0,12,20,0.95)] via-[rgba(0,12,20,0.6)] to-transparent flex items-center">
            <div className="container mx-auto px-6">
              <span className="bg-[rgba(197,160,89,0.15)] text-[var(--primary)] px-5 py-2 rounded-lg text-[0.75rem] font-black uppercase tracking-widest mb-8 block w-fit border border-[rgba(197,160,89,0.2)]">{s.tag}</span>
              <h1 className="text-white text-6xl md:text-8xl font-black mb-8 leading-[1.05] tracking-tight">
                {s.title.split(' ').map((word, idx) => (
                  <span key={idx} className={word === 'SKIES.' || word === 'BOUNDARIES.' ? 'text-[var(--primary)]' : ''}>
                    {word}{' '}
                  </span>
                ))}
              </h1>
              <p className="text-[var(--text-muted)] text-xl mb-12 max-w-[650px] leading-relaxed font-medium">
                {s.desc}
              </p>
              <div className="flex gap-6">
                 <button className="btn-primary">Explore Routes</button>
                 <button className="px-10 py-4 rounded-xl border border-[rgba(255,255,255,0.1)] font-extrabold text-[0.85rem] tracking-wider text-white hover:bg-white hover:text-dark transition-all">Join Rewards</button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
