'use client';

import React, { useState, useEffect } from 'react';
import AirportAutocomplete from '../components/search/AirportAutocomplete';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [activeSlide, setActiveSlide] = useState(0);
  const [tripType, setTripType] = useState('oneway');
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    date: '',
    passengers: '1'
  });

  const slides = [
    {
      tag: 'Premium Launch',
      title: <>ELEGANCE IN<br /><span className="text-[#C5A059]">THE SKIES.</span></>,
      desc: 'Experience the most luxurious cabin fleet in modern aviation. Book your dream destination today.',
      btn: 'EXPLORE ROUTES',
      bg: 'https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&w=1600&q=82'
    },
    {
      tag: 'Global Rewards',
      title: <>BEYOND<br /><span className="text-[#C5A059]">BOUNDARIES.</span></>,
      desc: 'Connecting 150+ international hubs with seamless transfers and premium comfort.',
      btn: 'JOIN REWARDS',
      bg: 'https://images.unsplash.com/photo-1542332213-9b5a5a3fab35?auto=format&fit=crop&w=1600&q=82'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleSearch = () => {
    const query = new URLSearchParams(searchData).toString();
    router.push(`/results?${query}`);
  };

  return (
    <section className="animate-fade-in">
      {/* Hero Carousel */}
      <div className="relative h-[450px] bg-[#020617] overflow-hidden mb-[-4rem]">
        {slides.map((slide, idx) => (
          <div 
            key={idx}
            className={`slide ${idx === activeSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.bg})` }}
          >
            <div className="slide-overlay">
              <div className="max-w-[1280px] mx-auto w-full">
                <span className="bg-[rgba(197,160,89,0.1)] text-[#C5A059] px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest mb-8 inline-block">
                  {slide.tag}
                </span>
                <h1 className="text-[68px] font-black leading-[1.1] mb-8 text-white italic">
                  {slide.title}
                </h1>
                <p className="text-[#94A3B8] text-lg mb-12 max-w-[600px] font-medium">
                  {slide.desc}
                </p>
                <button className="btn-primary py-4 px-16 text-lg rounded-2xl">
                  {slide.btn}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search Portal */}
      <div className="max-w-[1280px] mx-auto px-5 relative z-10 w-full">
        <div className="glass-card p-10 mt-16 bg-[rgba(5, 13, 28, 0.85)] border-[rgba(255,255,255,0.08)]">
          <div className="flex gap-12 mb-10 border-b border-[rgba(255,255,255,0.08)] pb-5">
            {['oneway', 'round', 'multi'].map((type) => (
              <button 
                key={type}
                className={`text-[13px] font-bold tracking-widest uppercase transition-all pb-3 border-b-2 ${
                  tripType === type 
                    ? 'text-[#C5A059] border-[#C5A059] font-black' 
                    : 'text-[#94A3B8] border-transparent'
                }`}
                onClick={() => setTripType(type)}
              >
                {type.replace(/([A-Z])/g, ' $1').toUpperCase()}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className="flex flex-col gap-2">
              <span className="input-label">Departure From</span>
              <AirportAutocomplete 
                placeholder="Enter City/Airport" 
                onSelect={(val) => setSearchData({...searchData, from: val})}
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="input-label">Destination To</span>
              <AirportAutocomplete 
                placeholder="Enter City/Airport"
                onSelect={(val) => setSearchData({...searchData, to: val})}
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="input-label">Travel Date</span>
              <input 
                type="date" 
                className="input-field" 
                onChange={(e) => setSearchData({...searchData, date: e.target.value})}
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="input-label">Travelers & Class</span>
              <select 
                className="input-field"
                onChange={(e) => setSearchData({...searchData, passengers: e.target.value})}
              >
                <option value="1">1 Adult, Economy</option>
                <option value="2">2 Adults, Economy</option>
                <option value="1B">1 Adult, Business</option>
                <option value="1F">1 Adult, First</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex gap-10">
              {['Special Student Fares', 'Armed Forces', 'Senior Citizen'].map((label) => (
                <label key={label} className="flex items-center gap-3 text-[13px] font-bold text-[#94A3B8] cursor-pointer group">
                  <input type="checkbox" className="w-[18px] h-[18px] accent-[#C5A059]" />
                  <span className="group-hover:text-[#C5A059] transition-colors">{label}</span>
                </label>
              ))}
            </div>
            <button 
              className="btn-primary py-5 px-20 text-xl rounded-2xl w-full md:w-auto"
              onClick={handleSearch}
            >
              SEARCH FLIGHTS
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-32 mb-16 px-5">
        {[
          { icon: 'fa-shield-alt', title: 'SECURE BOOKING', desc: 'Your transactions are protected by industry-leading 256-bit encryption.' },
          { icon: 'fa-check-circle', title: 'BEST FARE POLICY', desc: 'We guarantee the lowest fares, or we\'ll refund the double difference.' },
          { icon: 'fa-plane', title: 'PREMIUM FLEET', desc: 'Fly on the newest Dreamliners and A350s for maximum comfort.' },
          { icon: 'fa-user-shield', title: '24/7 CONCIERGE', desc: 'Get personalized assistance for any travel changes, anytime.' }
        ].map((feature, idx) => (
          <div key={idx} className="glass-card p-12 text-center group hover:-translate-y-2 transition-all duration-500">
            <div className="text-4xl text-[#C5A059] mb-8 group-hover:scale-110 transition-transform"><i className={`fas ${feature.icon}`}></i></div>
            <h4 className="font-black text-[13px] mb-4 tracking-[2px] text-white italic">{feature.title}</h4>
            <p className="text-[12px] text-[#94A3B8] leading-relaxed font-medium">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* Trending Destinations */}
      <div className="max-w-[1280px] mx-auto mt-32 mb-40 px-5">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="bg-[rgba(197,160,89,0.1)] text-[#C5A059] px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest mb-4 inline-block">Global Inspiration</span>
            <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase tracking-widest italic tracking-tighter">Trending <span className="text-[#C5A059]">Experiences</span></h2>
          </div>
          <button className="px-8 py-3 rounded-xl border border-white/10 text-[11px] font-black text-[#94A3B8] uppercase tracking-widest hover:bg-white/5 transition-all">Explore All</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { city: 'Santorini, GR', price: '₹54,999', img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=82' },
            { city: 'Tokyo, JP', price: '₹82,499', img: 'https://images.unsplash.com/photo-1542051841856-8f9accb5d7c4?auto=format&fit=crop&w=800&q=82' },
            { city: 'Maui, US', price: '₹76,999', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=82' }
          ].map((dest, idx) => (
            <div key={idx} className="glass-card overflow-hidden border-none cursor-pointer group relative h-[450px]">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" 
                style={{ backgroundImage: `url(${dest.img})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,8,20,0.9)] via-transparent to-transparent"></div>
              <div className="absolute bottom-10 left-10 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                <h3 className="text-3xl font-black text-white italic mb-2 tracking-tighter shadow-2xl">{dest.city}</h3>
                <span className="text-[#C5A059] font-black text-lg drop-shadow-lg">FROM {dest.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
