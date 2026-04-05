"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState("login"); // 'login' or 'register'
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (mode === "login") {
        await login({ email: formData.email, password: formData.password });
      } else {
        // Implementation for registration
        const response = await fetch("http://localhost:8000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error("Registration failed");
        await login({ email: formData.email, password: formData.password });
      }
      onClose();
    } catch (err) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative bg-[#081225] border border-white/10 p-12 rounded-[32px] w-full max-w-[500px] shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-8 right-8 text-text-muted hover:text-white transition-colors">
          <i className="fas fa-times text-xl"></i>
        </button>

        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-glow-gold">✈️</div>
          <h2 className="text-3xl font-black text-white uppercase tracking-wider">
            {mode === "login" ? "Welcome Back" : "Join SkyVoyage"}
          </h2>
          <p className="text-text-muted mt-3 font-semibold">
            {mode === "login" ? "Access your premium travel dashboard" : "Experience the future of air travel"}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm mb-8 text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {mode === "register" && (
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                className="input-field-auth"
                required
                value={formData.first_name}
                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
              />
              <input
                type="text"
                placeholder="Last Name"
                className="input-field-auth"
                required
                value={formData.last_name}
                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
              />
            </div>
          )}
          <input
            type="email"
            placeholder="Email Address"
            className="input-field-auth"
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input
            type="password"
            placeholder="Password"
            className="input-field-auth"
            required
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary py-5 rounded-2xl text-lg font-black mt-4 shadow-glow-gold disabled:opacity-50"
          >
            {loading ? "PROCESSING..." : mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
          </button>
        </form>

        <div className="text-center mt-10">
          <p className="text-text-muted font-bold text-sm">
            {mode === "login" ? "Don't have an account?" : "Already a member?"}
            <button 
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-primary ml-2 hover:underline tracking-widest"
            >
              {mode === "login" ? "SIGN UP" : "LOG IN"}
            </button>
          </p>
        </div>
      </motion.div>

      <style jsx>{`
        .input-field-auth {
          background: rgba(255, 255, 255, 0.03);
          border: 1px border rgba(255, 255, 255, 0.08);
          padding: 18px 24px;
          border-radius: 16px;
          color: white;
          outline: none;
          transition: all 0.3s;
          font-weight: 600;
          width: 100%;
        }
        .input-field-auth:focus {
          border-color: var(--primary);
          background: rgba(255, 255, 255, 0.05);
          box-shadow: 0 0 20px rgba(197, 160, 89, 0.1);
        }
      `}</style>
    </div>
  );
}
