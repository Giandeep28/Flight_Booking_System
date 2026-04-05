"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SeatMap from '../components/booking/SeatMap';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [seat, setSeat] = useState(null);
  const [flight, setFlight] = useState(null);
  const [pricedOffer, setPricedOffer] = useState(null);
  const [passenger, setPassenger] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    phone: '',
    dob: '1990-01-01',
    gender: 'MALE'
  });
  const [isBooking, setIsBooking] = useState(false);
  const [isPricing, setIsPricing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const saved = sessionStorage.getItem('selectedFlight');
    if (saved) setFlight(JSON.parse(saved));
    else router.push('/results');
  }, []);

  const handlePricing = async () => {
    setIsPricing(true);
    try {
      const res = await axios.post('http://localhost:5000/api/flights/price', {
        rawOffer: flight.rawOffer
      });
      if (res.data.error) throw new Error(res.data.error);
      setPricedOffer(res.data.data.flightOffers[0]);
      setStep(3);
    } catch (err) {
      alert("Pricing verification failed. The fare might have changed. Please search again.");
      router.push('/results');
    } finally {
      setIsPricing(false);
    }
  };

  const handleBooking = async () => {
    setIsBooking(true);
    try {
      const token = localStorage.getItem('skyvoyage_token');
      const res = await axios.post('http://localhost:5000/api/bookings', {
        passengers: [passenger],
        flightOffer: pricedOffer || flight.rawOffer,
        seatMap: { seat }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.error) throw new Error(res.data.error);
      
      alert(`Booking Successful! Live PNR: ${res.data.pnr}`);
      router.push('/dashboard');
    } catch (err) {
      alert("Global Booking Error: " + (err.response?.data?.error || err.message));
    } finally {
      setIsBooking(false);
    }
  };

  if (!flight) return null;

  return (
    <div className="min-h-screen bg-[#000814]">
      <Navbar />
      <div className="container mx-auto px-6 py-20 max-w-[1000px]">
         <div className="flex justify-between items-center mb-16 relative">
            <div className="h-[2px] bg-[rgba(255,255,255,0.05)] absolute top-1/2 left-0 w-full -z-10"></div>
            {[1, 2, 3].map(s => (
               <div key={s} className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-sm tracking-widest border-2 transition-all 
                 ${step >= s ? 'bg-[var(--primary)] text-dark border-[var(--primary)]' : 'bg-dark text-[var(--text-muted)] border-[rgba(255,255,255,0.1)]'}
               `}>
                 {s}
               </div>
            ))}
         </div>

         {step === 1 && (
           <div className="glass-card p-12 animate-in fade-in slide-in-from-bottom-5 duration-500">
              <h2 className="text-3xl font-black text-white mb-10 tracking-tight">TRAVELLER DETAILS (GDS COMPLIANT)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div>
                    <label className="text-[0.65rem] font-black uppercase text-[var(--text-muted)] mb-3 block tracking-widest">First Name</label>
                    <input type="text" className="input-field" placeholder="JOHN" value={passenger.firstName} onChange={e => setPassenger({...passenger, firstName: e.target.value.toUpperCase()})} />
                 </div>
                 <div>
                    <label className="text-[0.65rem] font-black uppercase text-[var(--text-muted)] mb-3 block tracking-widest">Last Name</label>
                    <input type="text" className="input-field" placeholder="DOE" value={passenger.lastName} onChange={e => setPassenger({...passenger, lastName: e.target.value.toUpperCase()})} />
                 </div>
                 <div>
                    <label className="text-[0.65rem] font-black uppercase text-[var(--text-muted)] mb-3 block tracking-widest">Date of Birth</label>
                    <input type="date" className="input-field" value={passenger.dob} onChange={e => setPassenger({...passenger, dob: e.target.value})} />
                 </div>
                 <div>
                    <label className="text-[0.65rem] font-black uppercase text-[var(--text-muted)] mb-3 block tracking-widest">Gender</label>
                    <select className="input-field" value={passenger.gender} onChange={e => setPassenger({...passenger, gender: e.target.value})}>
                       <option value="MALE">MALE</option>
                       <option value="FEMALE">FEMALE</option>
                    </select>
                 </div>
                 <div>
                    <label className="text-[0.65rem] font-black uppercase text-[var(--text-muted)] mb-3 block tracking-widest">Contact Number</label>
                    <input type="tel" className="input-field" placeholder="9988776655" value={passenger.phone} onChange={e => setPassenger({...passenger, phone: e.target.value})} />
                 </div>
                 <div>
                    <label className="text-[0.65rem] font-black uppercase text-[var(--text-muted)] mb-3 block tracking-widest">Email Address</label>
                    <input type="email" className="input-field" placeholder="john@skyvoyage.com" value={passenger.email} onChange={e => setPassenger({...passenger, email: e.target.value})} />
                 </div>
              </div>
              <button 
                onClick={() => { if(passenger.firstName && passenger.lastName) setStep(2); else alert("Full name is required for GDS"); }}
                className="btn-primary mt-12 w-full h-16 shadow-[0_15px_30px_rgba(197,160,89,0.2)]"
              >
                Continue to Seat Selection
              </button>
           </div>
         )}

         {step === 2 && (
           <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
              <h2 className="text-3xl font-black text-white mb-10 tracking-tight text-center">SELECT YOUR PREFERRED SEAT</h2>
              <SeatMap onSelect={setSeat} />
              <div className="flex gap-6 mt-12">
                 <button onClick={() => setStep(1)} className="flex-1 px-10 py-4 h-16 border border-[rgba(255,255,255,0.1)] rounded-2xl font-black text-xs tracking-widest text-white hover:bg-white hover:text-dark transition-all">Go Back</button>
                 <button onClick={handlePricing} disabled={isPricing} className="btn-primary flex-1 h-16">
                    {isPricing ? 'VERIFYING LIVE FARE...' : 'CONFIRM SELECTION'}
                 </button>
              </div>
           </div>
         )}

         {step === 3 && (
           <div className="glass-card p-12 text-center animate-in fade-in slide-in-from-bottom-5 duration-500">
              <div className="w-24 h-24 bg-[rgba(197,160,89,0.1)] rounded-full flex items-center justify-center text-[var(--primary)] text-4xl mx-auto mb-8 border border-[rgba(197,160,89,0.2)]">
                <i className="fas fa-plane-lock"></i>
              </div>
              <h2 className="text-3xl font-black text-white mb-4 tracking-tight uppercase">Order Finalization</h2>
              <p className="text-[var(--text-muted)] text-sm mb-12 font-medium tracking-wide uppercase">Confirmed Amadeus Fare Active</p>
              
              <div className="flex flex-col gap-6 max-w-[400px] mx-auto">
                 <div className="flex justify-between border-b border-[rgba(255,255,255,0.05)] pb-4">
                    <span className="text-[0.65rem] font-black uppercase text-[var(--text-muted)] tracking-widest">Base Fare (Verified)</span>
                    <span className="text-white font-black">{pricedOffer?.price?.currency} {pricedOffer?.price?.total}</span>
                 </div>
                 <div className="flex justify-between border-b border-[rgba(255,255,255,0.05)] pb-4">
                    <span className="text-[0.65rem] font-black uppercase text-[var(--text-muted)] tracking-widest">GDS Taxes</span>
                    <span className="text-white font-black">INCLUDED</span>
                 </div>
                 <div className="flex justify-between pb-4">
                    <span className="text-[0.65rem] font-black uppercase text-[var(--text-muted)] tracking-widest">Final Total</span>
                    <span className="text-[var(--primary)] text-2xl font-black">{pricedOffer?.price?.total} {pricedOffer?.price?.currency}</span>
                 </div>
              </div>
              <button 
                onClick={handleBooking}
                disabled={isBooking}
                className="btn-primary mt-12 w-full h-16 shadow-[0_15px_40px_rgba(197,160,89,0.3)] disabled:opacity-50"
              >
                {isBooking ? 'GENERATING PNR IN GDS...' : `PAY & BOOK ${pricedOffer?.price?.total} ${pricedOffer?.price?.currency}`}
              </button>
           </div>
         )}
      </div>
      <Footer />
    </div>
  );
}
