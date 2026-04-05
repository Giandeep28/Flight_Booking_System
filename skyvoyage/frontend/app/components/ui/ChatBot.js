"use client";
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Welcome to SkyVoyage. I am your premium travel assistant. How may I guide your journey today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input) return;
    const userMsg = input;
    setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
    setInput('');

    try {
      const res = await axios.post('http://localhost:5000/api/chat', { text: userMsg });
      setMessages(prev => [...prev, { text: res.data.reply, isBot: true }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: "I'm having trouble connecting. Please try again later.", isBot: true }]);
    }
  };

  return (
    <>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-10 right-10 w-20 h-20 bg-[var(--primary)] rounded-full flex items-center justify-center text-dark text-3xl cursor-pointer shadow-[0_15px_40px_rgba(197,160,89,0.4)] z-[2000] hover:scale-110 active:scale-95 transition-all"
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-robot'}`}></i>
      </div>

      {isOpen && (
        <div className="fixed bottom-32 right-10 w-[420px] h-[600px] bg-[#050d1c] rounded-[2rem] shadow-[0_40px_100px_rgba(0,0,0,0.9)] z-[2000] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-500 border border-[rgba(255,255,255,0.05)]">
           <div className="p-8 bg-[var(--primary)] text-dark flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl">🕊️</div>
              <div>
                <div className="text-sm font-black tracking-widest uppercase">SkyBot</div>
                <div className="text-[0.6rem] font-bold opacity-70 tracking-widest uppercase">Premium Concierge Active</div>
              </div>
           </div>

           <div className="flex-1 p-8 overflow-y-auto space-y-6 bg-[#020617]">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] p-5 rounded-2xl text-sm leading-relaxed font-semibold transition-all
                    ${m.isBot ? 'bg-[rgba(255,255,255,0.04)] text-[var(--text-muted)] border border-[rgba(255,255,255,0.02)]' : 'bg-[var(--primary)] text-dark'}
                  `}>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
           </div>

           <div className="p-8 bg-[#050d1c] border-t border-[rgba(255,255,255,0.05)] flex gap-4">
              <input 
                type="text" 
                placeholder="Ask SkyBot..." 
                className="flex-1 bg-transparent border-b border-[rgba(255,255,255,0.1)] text-white p-2 text-sm outline-none focus:border-[var(--primary)] transition-all font-semibold"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button 
                onClick={sendMessage}
                className="w-12 h-12 bg-[var(--primary)] text-dark rounded-xl flex items-center justify-center hover:bg-white transition-colors"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
           </div>
        </div>
      )}
    </>
  );
}
