"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function ProfilePage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    nationality: user?.nationality || "Indian",
  });

  return (
    <div className="flex flex-col gap-12">
      <div>
        <h1 className="text-4xl font-black text-white uppercase tracking-wider mb-3">PROFILE SETTINGS</h1>
        <p className="text-text-muted font-semibold tracking-wide">Manage your personal identity and travel documents</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card bg-dark/80 border border-white/10 p-12 rounded-[40px]">
          <h3 className="text-xl font-black text-white uppercase tracking-[2px] mb-10 flex items-center gap-4">
            <i className="fas fa-user-circle text-primary"></i>
            Personal Information
          </h3>
          
          <form className="flex flex-col gap-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-3">
                <label className="text-[0.6rem] font-black text-text-muted uppercase tracking-[2px] ml-2">First Name</label>
                <input 
                  type="text" 
                  value={formData.first_name}
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                  className="bg-white/5 border border-white/10 p-5 rounded-2xl text-white font-bold outline-none focus:border-primary/50 transition-all"
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[0.6rem] font-black text-text-muted uppercase tracking-[2px] ml-2">Last Name</label>
                <input 
                  type="text" 
                  value={formData.last_name}
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                  className="bg-white/5 border border-white/10 p-5 rounded-2xl text-white font-bold outline-none focus:border-primary/50 transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[0.6rem] font-black text-text-muted uppercase tracking-[2px] ml-2">Email Address</label>
              <input 
                type="email" 
                value={formData.email}
                disabled
                className="bg-white/5 border border-white/10 p-5 rounded-2xl text-text-muted font-bold outline-none cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[0.6rem] font-black text-text-muted uppercase tracking-[2px] ml-2">Phone Number</label>
              <input 
                type="tel" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="bg-white/5 border border-white/10 p-5 rounded-2xl text-white font-bold outline-none focus:border-primary/50 transition-all"
              />
            </div>

            <button className="btn btn-primary py-5 rounded-2xl font-black tracking-widest shadow-glow-gold mt-4">SAVE CHANGES</button>
          </form>
        </div>

        <div className="flex flex-col gap-8">
          <div className="glass-card bg-dark/80 border border-white/10 p-10 rounded-[32px]">
            <h3 className="text-lg font-black text-white uppercase tracking-[2px] mb-8 flex items-center gap-4">
              <i className="fas fa-passport text-primary"></i>
              Travel Documents
            </h3>
            <div className="p-6 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  <i className="fas fa-file-invoice"></i>
                </div>
                <div>
                  <div className="text-xs font-black text-white tracking-wider">PASSPORT (INDIAN)</div>
                  <div className="text-[0.6rem] text-text-muted font-bold">Expires: Oct 2029</div>
                </div>
              </div>
              <button className="text-primary hover:text-white transition-colors"><i className="fas fa-edit"></i></button>
            </div>
            <button className="w-full py-4 border border-dashed border-white/10 rounded-2xl text-[0.65rem] font-black text-text-muted uppercase tracking-widest hover:border-primary/50 hover:text-primary transition-all">
              + ADD NEW DOCUMENT
            </button>
          </div>

          <div className="glass-card bg-red-500/5 border border-red-500/10 p-10 rounded-[32px]">
            <h3 className="text-lg font-black text-white uppercase tracking-[2px] mb-6">Danger Zone</h3>
            <p className="text-xs text-text-muted mb-8 font-semibold">Deleting your account will remove all SkyMiles and travel history permanently.</p>
            <button className="text-red-500 text-[0.7rem] font-black uppercase tracking-[2px] hover:underline">Deactivate Account</button>
          </div>
        </div>
      </div>
    </div>
  );
}
