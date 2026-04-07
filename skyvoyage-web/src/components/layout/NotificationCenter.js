"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      title: "Flight Updated", 
      message: "Flight SV-421 (DEL → BOM) is now boarding at Gate 4A.", 
      time: "2m ago",
      type: "alert",
      unread: true
    },
    { 
      id: 2, 
      title: "SkyMiles Earned", 
      message: "You just earned 450 miles for your recent trip to London!", 
      time: "1h ago",
      type: "success",
      unread: true
    },
    { 
      id: 3, 
      title: "Gold Tier Unlock", 
      message: "Complete 2 more flights to unlock Gold status perks.", 
      time: "5h ago",
      type: "promo",
      unread: false
    }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-11 h-11 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary transition-all relative group shadow-sm hover:shadow-md"
      >
        <i className="fas fa-bell"></i>
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-4 h-4 bg-primary text-[#000814] text-[0.6rem] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-[1099]" 
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-[120%] right-0 w-80 md:w-96 bg-white border border-black/5 rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.15)] z-[1100] overflow-hidden"
            >
              <div className="p-6 border-b border-black/5 flex justify-between items-center">
                <h3 className="text-sm font-black text-[#000814] uppercase tracking-[2px]">Notifications</h3>
                <button className="text-[0.6rem] font-black text-primary uppercase tracking-widest hover:underline">Mark all read</button>
              </div>

              <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                {notifications.map((n) => (
                  <div 
                    key={n.id} 
                    className={`p-6 border-b border-black/5 flex gap-4 hover:bg-slate-50 transition-all cursor-pointer ${n.unread ? 'bg-primary/5' : ''}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm shrink-0 ${
                      n.type === 'alert' ? 'bg-red-500/10 text-red-500' :
                      n.type === 'success' ? 'bg-green-500/10 text-green-500' :
                      'bg-primary/10 text-primary'
                    }`}>
                      <i className={`fas ${
                        n.type === 'alert' ? 'fa-exclamation-triangle' :
                        n.type === 'success' ? 'fa-check-circle' :
                        'fa-star'
                      }`}></i>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-black text-[#000814] uppercase tracking-wider">{n.title}</span>
                        <span className="text-[0.6rem] font-bold text-slate-400 uppercase tracking-tighter">{n.time}</span>
                      </div>
                      <p className="text-[0.75rem] text-slate-500 leading-relaxed font-semibold">{n.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-slate-50 text-center">
                <button className="text-[0.65rem] font-black text-[#000814] uppercase tracking-widest hover:text-primary transition-colors">See all alerts</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
