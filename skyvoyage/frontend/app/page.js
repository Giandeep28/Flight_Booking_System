import React from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/ui/Hero';
import SearchPortal from './components/search/SearchPortal';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#000814]">
      <Navbar />
      <main>
        <Hero />
        <SearchPortal />
        
        {/* Features Section */}
        <div className="container mx-auto px-6 py-32 grid grid-cols-1 md:grid-cols-4 gap-8">
           {[
             { icon: 'shield-alt', title: 'SECURE BOOKING', desc: 'Protected by industry-leading 256-bit encryption.' },
             { icon: 'check-circle', title: 'BEST FARE POLICY', desc: 'Guaranteed lowest fares or we refund the difference.' },
             { icon: 'plane', title: 'PREMIUM FLEET', desc: 'Fly on the newest Dreamliners and A350s.' },
             { icon: 'user-shield', title: '24/7 CONCIERGE', desc: 'Personalized assistance for any travel changes.' }
           ].map((f, i) => (
             <div key={i} className="glass-card p-12 text-center hover:bg-[rgba(255,255,255,0.05)] transition-all transform hover:-translate-y-2">
                <div className="text-[var(--primary)] text-4xl mb-8"><i className={`fas fa-${f.icon}`}></i></div>
                <h4 className="font-black text-sm tracking-widest text-white mb-4 uppercase">{f.title}</h4>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed font-medium">{f.desc}</p>
             </div>
           ))}
        </div>

        {/* Trending Destinations */}
        <div className="container mx-auto px-6 pb-40">
           <div className="flex justify-between items-end mb-16">
              <div>
                <span className="bg-[rgba(197,160,89,0.1)] text-[var(--primary)] px-4 py-1 rounded text-[0.65rem] font-black uppercase tracking-widest mb-4 block w-fit">Global Inspiration</span>
                <h2 className="text-white text-5xl font-black tracking-tight">TRENDING EXPERIENCES</h2>
              </div>
              <button className="px-8 py-3 rounded-xl border border-[rgba(255,255,255,0.1)] font-bold text-xs tracking-widest text-white hover:bg-white hover:text-dark transition-all">EXPLORE ALL</button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { city: 'Santorini, GR', price: '₹54,999', img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=82' },
                { city: 'Tokyo, JP', price: '₹82,499', img: 'https://images.unsplash.com/photo-1542051841856-8f9accb5d7c4?auto=format&fit=crop&w=800&q=82' },
                { city: 'Maui, US', price: '₹76,999', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=82' }
              ].map((d, i) => (
                <div key={i} className="rounded-[2.5rem] overflow-hidden group cursor-pointer relative h-[450px]">
                   <img src={d.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={d.city} />
                   <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,8,20,0.9)] via-transparent to-transparent"></div>
                   <div className="absolute bottom-10 left-10">
                      <h3 className="text-white text-3xl font-black mb-1">{d.city}</h3>
                      <span className="text-[var(--primary)] font-black text-lg tracking-widest">FROM {d.price}</span>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
