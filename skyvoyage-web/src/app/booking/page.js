'use client';

import React, { useState } from 'react';
import SeatMap from '../../components/booking/SeatMap';

const BookingPage = () => {
  const [step, setStep] = useState(1);
  const [passenger, setPassenger] = useState({ name: '', email: '', phone: '' });
  const [selectedSeat, setSelectedSeat] = useState(null);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  return (
    <div className="max-w-[1100px] mx-auto px-5 py-12 animate-fade-in text-[#000814] font-sans">
      <div className="flex justify-between items-center mb-12 border-b border-black/5 pb-8 relative">
        <div className={`step-item ${step >= 1 ? 'active' : ''}`}>1. TRAVELER</div>
        <div className={`step-item ${step >= 2 ? 'active' : ''}`}>2. SEAT SELECTION</div>
        <div className={`step-item ${step >= 3 ? 'active' : ''}`}>3. PAYMENT</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
        <div>
          {step === 1 && (
            <div className="glass-card p-12 bg-white animate-fade-in shadow-xl rounded-3xl">
              <h2 className="text-4xl font-black mb-10 italic tracking-tight"><span className="text-[#C5A059]">PASSENGER</span> DETAILS</h2>
              <div className="flex flex-col gap-8">
                <div className="group">
                  <span className="input-label">Full Legal Name</span>
                  <input type="text" className="input-field" placeholder="e.g. John Doe" />
                </div>
                <div className="group">
                  <span className="input-label">Communication Email</span>
                  <input type="email" className="input-field" placeholder="e.g. john@skyvoyage.com" />
                </div>
                <div className="group">
                  <span className="input-label">Mobile Contact</span>
                  <input type="tel" className="input-field" placeholder="+91 98765-43210" />
                </div>
                <button className="btn-primary py-5 px-16 text-xl rounded-2xl w-full mt-6" onClick={handleNext}>
                  CONTINUE TO SEATS <i className="fas fa-arrow-right ml-3 text-sm"></i>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="glass-card p-12 bg-white animate-fade-in shadow-xl rounded-3xl">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-4xl font-black italic tracking-tight text-[#000814]">CHOOSE <span className="text-[#C5A059]">EXPERIENCE</span></h2>
                <div className="bg-[rgba(197, 160, 89, 0.1)] px-5 py-2 rounded-xl text-[12px] font-black text-[#C5A059] uppercase tracking-widest border border-[rgba(197,160,89,0.1)]">
                  737 Dreamliner
                </div>
              </div>
              <SeatMap onSelect={(s) => setSelectedSeat(s)} />
              <div className="flex justify-between items-center mt-12 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-[rgba(197, 160, 89, 0.2)] flex items-center justify-center rounded-xl text-[#C5A059] text-xl font-black italic">
                    {selectedSeat || '--'}
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase">Selected Seat</div>
                    <div className="text-[14px] font-extrabold text-[#000814]">Main Cabin Comfort</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button className="btn-outline px-8 py-3 rounded-xl text-sm border border-slate-200 hover:bg-slate-50 transition-all font-bold uppercase tracking-widest text-[#94A3B8]" onClick={handleBack}>BACK</button>
                  <button className="btn-primary px-12 py-3 rounded-xl text-sm font-black uppercase tracking-widest" disabled={!selectedSeat} onClick={handleNext}>PAYMENT</button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="glass-card p-12 animate-fade-in bg-white shadow-xl rounded-3xl">
              <h2 className="text-4xl font-black mb-10 italic tracking-tight text-[#000814]"><span className="text-[#C5A059]">SECURE</span> CHECKOUT</h2>
              <div className="flex flex-col gap-10">
                <div className="grid grid-cols-2 gap-8">
                   <div className="flex flex-col gap-3">
                      <span className="input-label">Card Number</span>
                      <input type="text" className="input-field" placeholder="•••• •••• •••• ••••" />
                   </div>
                   <div className="flex flex-col gap-3">
                      <span className="input-label">Expiry Date</span>
                      <input type="text" className="input-field" placeholder="MM / YY" />
                   </div>
                </div>
                <div className="p-8 rounded-2xl bg-[#C5A059] text-[#000814] flex justify-between items-center">
                   <div>
                      <div className="text-[11px] font-black uppercase tracking-widest mb-1 opacity-80">Total Payable</div>
                      <div className="text-4xl font-black italic tracking-tighter">₹15,499.00</div>
                   </div>
                   <button className="bg-[#000814] text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-white hover:text-[#000814] transition-all uppercase tracking-widest shadow-2xl">
                      PAY NOW <i className="fas fa-lock ml-2 text-sm opacity-60"></i>
                   </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Fare Summary Widget */}
        <aside>
          <div className="glass-card p-8 sticky top-[110px] bg-white border-black/5 shadow-xl rounded-3xl">
            <h4 className="text-[13px] font-black uppercase tracking-[3px] text-[#C5A059] mb-8 italic">Fare Summary</h4>
            <div className="flex flex-col gap-5 border-b border-black/5 pb-8 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-[14px] font-bold">Base Fare (1 Adult)</span>
                <span className="text-[#000814] font-black">₹11,500</span>
              </div>
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-slate-400 font-bold">Taxes & Fees</span>
                <span className="text-[#000814] font-bold">₹3,499</span>
              </div>
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-slate-400 font-bold">Convenience Fee</span>
                <span className="text-[#000814] font-bold">₹500</span>
              </div>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-[11px] font-black text-[#C5A059] uppercase mb-1">Total Savings</div>
                <div className="text-[14px] font-black text-emerald-400">₹1,200</div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-black text-slate-400 uppercase italic mb-1">Final Amount</div>
                <div className="text-3xl font-black text-[#000814] italic tracking-tighter uppercase tracking-widest">₹14,299</div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <style jsx>{`
        .step-item { @apply text-[13px] font-black text-[#334155] uppercase tracking-[3px] relative; transition: all 0.4s; }
        .step-item.active { @apply text-[#C5A059]; }
        .step-item::after { content: ''; position: absolute; bottom: -33px; left: 0; width: 0; height: 3px; background: #C5A059; transition: all 0.5s; }
        .step-item.active::after { width: 100%; }
      `}</style>
    </div>
  );
};

export default BookingPage;
