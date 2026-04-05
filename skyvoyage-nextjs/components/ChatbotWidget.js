'use client';

import { useState, useRef, useEffect } from 'react';
import { chatbotAPI } from '@/lib/api';

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Welcome to SkyVoyage. Ask about flights, airports, or your booking.' },
  ]);
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', text }]);
    setLoading(true);
    try {
      const data = await chatbotAPI.sendMessage(text);
      setMessages((m) => [...m, { role: 'bot', text: data.reply || 'No response.' }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          role: 'bot',
          text: e.message || 'Chat unavailable. Set OPENAI_API_KEY on the Python service.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        id="chatbot-trigger"
        aria-label="Open chat"
        onClick={() => setOpen(!open)}
      >
        <i className="fas fa-robot" />
      </button>
      <div
        id="chatbot-window"
        style={{
          display: open ? 'flex' : 'none',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            background: 'var(--primary)',
            padding: '1.8rem',
            color: 'var(--dark)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                background: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
              }}
            >
              🕊️
            </div>
            <div>
              <div style={{ fontWeight: 950, fontSize: '1rem', letterSpacing: '0.5px' }}>SKYBOT</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.8 }}>AI Assistance</div>
            </div>
          </div>
          <button type="button" aria-label="Close" onClick={() => setOpen(false)} style={{ cursor: 'pointer', background: 'none', border: 'none', fontSize: '1.2rem' }}>
            <i className="fas fa-times" />
          </button>
        </div>
        <div
          ref={listRef}
          id="chat-messages"
          style={{
            flex: 1,
            padding: '2rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.2rem',
            background: '#01040a',
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              style={
                msg.role === 'user'
                  ? {
                      alignSelf: 'flex-end',
                      background: 'var(--primary)',
                      color: 'var(--dark)',
                      padding: '1.2rem',
                      borderRadius: '18px 18px 0 18px',
                      maxWidth: '85%',
                      fontSize: '0.9rem',
                      fontWeight: 800,
                    }
                  : {
                      background: 'rgba(255,255,255,0.04)',
                      padding: '1.2rem',
                      borderRadius: '18px 18px 18px 0',
                      maxWidth: '85%',
                      fontSize: '0.9rem',
                      lineHeight: 1.5,
                    }
              }
            >
              {msg.text}
            </div>
          ))}
          {loading && <div className="text-text-muted text-sm">Thinking…</div>}
        </div>
        <div
          style={{
            padding: '1.5rem',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            gap: '12px',
            background: '#050d1c',
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Ask about travel…"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid var(--border)',
              color: 'white',
              paddingBottom: '8px',
              outline: 'none',
            }}
          />
          <button type="button" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', borderRadius: '10px' }} onClick={send}>
            <i className="fas fa-paper-plane" />
          </button>
        </div>
      </div>
    </>
  );
}
