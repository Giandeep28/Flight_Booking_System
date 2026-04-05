"use client";
import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async () => {
    setLoading(true);
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const res = await axios.post(`http://localhost:5000${endpoint}`, form);
      localStorage.setItem('skyvoyage_token', res.data.token);
      localStorage.setItem('skyvoyage_user', JSON.stringify(res.data.user));
      router.push('/dashboard');
    } catch (err) {
      alert("Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000814]">
      <Navbar />
      <div className="container mx-auto px-6 py-32 flex justify-center items-center">
        <div className="glass-card p-12 md:p-16 w-full max-w-[500px] animate-in fade-in slide-in-from-bottom-5 duration-700">
           <h1 className="text-4xl font-black text-white mb-4 tracking-tight uppercase">
              {isLogin ? 'Welcome Back' : 'Join SkyVoyage'}
           </h1>
           <p className="text-[var(--text-muted)] text-sm mb-12 font-medium tracking-wide">
              {isLogin ? 'Access your personalized premium travel dashboard.' : 'Start your elite journey with global connectivity.'}
           </p>

           <div className="space-y-8">
              {!isLogin && (
                <div className="space-y-3">
                  <label className="text-[0.65rem] font-black uppercase text-[var(--text-muted)] tracking-widest block">Full Name</label>
                  <input type="text" placeholder="John Malhotra" className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
              )}
              <div className="space-y-3">
                <label className="text-[0.65rem] font-black uppercase text-[var(--text-muted)] tracking-widest block">Email Address</label>
                <input type="email" placeholder="john@skyvoyage.com" className="input-field" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
              <div className="space-y-3">
                <label className="text-[0.65rem] font-black uppercase text-[var(--text-muted)] tracking-widest block">Security Password</label>
                <input type="password" placeholder="••••••••" className="input-field" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
              </div>
           </div>

           <button 
             onClick={handleAuth}
             disabled={loading}
             className="btn-primary w-full h-16 mt-12 shadow-[0_15px_30px_rgba(197,160,89,0.2)] disabled:opacity-50"
           >
             {loading ? 'Processing...' : (isLogin ? 'Continue Access' : 'Create Account')}
           </button>

           <div className="mt-10 text-center">
              <p className="text-[var(--text-muted)] text-xs font-bold tracking-widest">
                {isLogin ? "DON'T HAVE AN ACCOUNT?" : "ALREADY A MEMBER?"}
                <button 
                  onClick={() => setIsLogin(!isLogin)} 
                  className="text-[var(--primary)] ml-3 hover:text-white transition-colors uppercase"
                >
                  {isLogin ? 'Sign Up Now' : 'Sign In'}
                </button>
              </p>
           </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
