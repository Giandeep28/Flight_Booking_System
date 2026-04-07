"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { motion } from "framer-motion";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const pnr = searchParams.get("pnr") || "SV" + Math.random().toString(36).substring(2, 8).toUpperCase();

  return (
    <div className="container py-40 min-h-screen text-center">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card bg-white border border-black/5 p-16 md:p-24 rounded-[40px] max-w-[800px] mx-auto shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-primary/20 blur-[100px] rounded-full" />
        
        <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-5xl mx-auto mb-10 shadow-glow-gold relative z-10">✓</div>
        
        <h1 className="text-4xl md:text-5xl font-black text-[#000814] uppercase tracking-wider mb-6">VOYAGE CONFIRMED</h1>
        <p className="text-xl text-slate-500 mb-12 font-semibold">Your premium flight experience is now secured. Check your email for the E-Ticket.</p>

        <div className="bg-slate-50 border border-slate-100 p-10 rounded-2xl mb-12 inline-block">
          <div className="text-[0.8rem] font-black text-primary uppercase tracking-[4px] mb-3">Booking Reference (PNR)</div>
          <div className="text-5xl font-black text-[#000814] tracking-[8px]">{pnr}</div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 justify-center mt-8">
          <Link href="/" className="btn btn-primary px-12 py-5 rounded-2xl font-black tracking-widest shadow-lg">GO TO DASHBOARD</Link>
          <button className="bg-slate-50 border border-slate-200 text-[#000814] px-12 py-5 rounded-2xl font-black tracking-widest hover:bg-slate-100 transition-all">DOWNLOAD TICKET</button>
        </div>
      </motion.div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="container py-40 text-center text-primary font-black">LOADING CONFIRMATION...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
