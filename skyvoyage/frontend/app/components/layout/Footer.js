import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#020617] pt-24 pb-12 border-t border-[rgba(255,255,255,0.05)] mt-24">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div>
          <div className="flex items-center gap-3 text-2xl font-black mb-8 tracking-widest">
            <div className="w-[45px] h-[45px] bg-[var(--primary)] rounded-xl flex items-center justify-center text-2xl">✈️</div>
            <span className="text-white">SKYVOYAGE</span>
          </div>
          <p className="text-[var(--text-muted)] text-sm leading-8 mb-8 font-medium">Redefining the art of air travel with premium comfort and global connectivity. Fly the skies with elegance.</p>
          <div className="flex gap-4">
             {[1,2,3,4].map(i => (
               <div key={i} className="w-11 h-11 bg-[rgba(255,255,255,0.05)] rounded-full flex items-center justify-center text-[var(--primary)] hover:bg-white transition-colors cursor-pointer">
                 <i className={`fab fa-${['facebook-f', 'twitter', 'instagram', 'linkedin-in'][i-1]}`}></i>
               </div>
             ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-black text-[var(--primary)] text-xs tracking-[2px] mb-8 uppercase">Flight Services</h4>
          <ul className="space-y-4 text-sm font-semibold text-[var(--text-muted)]">
            <li className="hover:text-white transition-colors cursor-pointer">International Routes</li>
            <li className="hover:text-white transition-colors cursor-pointer">Domestic Hubs</li>
            <li className="hover:text-white transition-colors cursor-pointer">Flight Status</li>
            <li className="hover:text-white transition-colors cursor-pointer">Online Check-in</li>
          </ul>
        </div>

        <div>
          <h4 className="font-black text-[var(--primary)] text-xs tracking-[2px] mb-8 uppercase">Support & help</h4>
          <ul className="space-y-4 text-sm font-semibold text-[var(--text-muted)]">
            <li className="hover:text-white transition-colors cursor-pointer">Help Desk</li>
            <li className="hover:text-white transition-colors cursor-pointer">Baggage Info</li>
            <li className="hover:text-white transition-colors cursor-pointer">Refund Policy</li>
            <li className="hover:text-white transition-colors cursor-pointer">Special Assistance</li>
          </ul>
        </div>

        <div>
          <h4 className="font-black text-[var(--primary)] text-xs tracking-[2px] mb-8 uppercase">Sky Newsletter</h4>
          <p className="text-[var(--text-muted)] text-sm mb-6 leading-relaxed font-medium">Join our elite list for early bird offers and member-only news.</p>
          <div className="flex gap-3">
             <input type="email" placeholder="Email" className="flex-1 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] p-4 rounded-xl text-white text-sm outline-none" />
             <button className="bg-[var(--primary)] text-dark px-6 rounded-xl hover:bg-white transition-colors">
               <i className="fas fa-paper-plane"></i>
             </button>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-6 pt-12 border-t border-[rgba(255,255,255,0.05)] text-center">
         <p className="text-[var(--text-muted)] text-[0.75rem] font-bold tracking-widest uppercase">© 2026 SKYVOYAGE AIRLINES. ALL RIGHTS RESERVED. DESIGNED FOR EXCELLENCE.</p>
      </div>
    </footer>
  );
}
