"use client";

import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

export default function LoyaltyPage() {
  const { user } = useAuth();
  
  const tierInfo = {
    silver: { 
      next: "GOLD", 
      progress: 65, 
      pointsNeeded: 1200,
      benefits: ["Standard Seat Selection", "1x 23kg Checked Bag", "5% Miles Multiplier"]
    },
    gold: { 
      next: "PLATINUM", 
      progress: 40, 
      pointsNeeded: 5000,
      benefits: ["Priority Boarding", "Lounge Access", "Extra Legroom Seat", "15% Miles Multiplier"]
    },
    platinum: { 
      next: "MAX", 
      progress: 100, 
      pointsNeeded: 0,
      benefits: ["Global Lounge Pass", "First Class Upgrade", "No Change Fees", "25% Miles Multiplier"]
    }
  };

  const currentTier = user?.loyalty?.tier?.toLowerCase() || "silver";
  const info = tierInfo[currentTier];

  return (
    <div className="flex flex-col gap-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-wider mb-3">SKYMILES REWARDS</h1>
          <p className="text-text-muted font-semibold tracking-wide">Track your tier progress and unlock premium benefits</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 glass-card bg-dark/80 border border-white/10 p-12 rounded-[40px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="flex justify-between items-start mb-16 relative z-10">
            <div>
              <div className="text-[0.65rem] font-black text-primary uppercase tracking-[4px] mb-4 italic">Membership Status</div>
              <h2 className="text-6xl font-black text-white uppercase tracking-tighter">
                {currentTier} <span className="text-primary italic">TIER</span>
              </h2>
            </div>
            <div className="text-right">
              <div className="text-[0.65rem] font-black text-text-muted uppercase tracking-[4px] mb-4 italic">Total Points</div>
              <div className="text-6xl font-black text-white">{user?.loyalty?.points || 2450}</div>
            </div>
          </div>

          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-black text-white uppercase tracking-widest italic">Progress to {info.next}</span>
              <span className="text-xs font-black text-primary uppercase tracking-widest italic">{info.pointsNeeded} Points Remaining</span>
            </div>
            <div className="h-4 bg-white/5 border border-white/10 rounded-full overflow-hidden p-1">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${info.progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-primary rounded-full shadow-glow-gold relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30" />
              </motion.div>
            </div>
          </div>
        </div>

        <div className="glass-card bg-primary border border-primary p-12 rounded-[40px] shadow-glow-gold flex flex-col justify-center text-dark relative overflow-hidden">
           <div className="absolute top-[-20px] left-[-20px] text-[10rem] opacity-10 pointer-events-none rotate-12">
            <i className="fas fa-crown"></i>
          </div>
          <h4 className="text-sm font-black uppercase tracking-[3px] mb-6">Exclusive Offer</h4>
          <p className="text-xl font-black italic uppercase leading-tight mb-8">Upgrade to Gold today for 50% fewer miles!</p>
          <button className="bg-dark text-white font-black py-4 px-8 rounded-2xl text-xs tracking-widest hover:scale-105 transition-all">REDEEM NOW</button>
        </div>
      </div>

      <div className="glass-card bg-dark/80 border border-white/10 p-12 rounded-[40px]">
        <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-10 pb-6 border-b border-white/5 flex items-center gap-4">
          <i className="fas fa-list-check text-primary"></i>
          Tier Benefits
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {info.benefits.map((benefit, i) => (
            <div key={i} className="flex items-center gap-5 p-6 bg-white/5 border border-white/5 rounded-2xl group hover:border-primary/30 transition-all">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-dark transition-all">
                <i className="fas fa-check text-sm"></i>
              </div>
              <span className="text-sm font-bold text-white tracking-wide">{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
