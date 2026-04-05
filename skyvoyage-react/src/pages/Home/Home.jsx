import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Globe, MapPin, Calendar, Users, ArrowRight, Star } from 'lucide-react';

const Home = () => {
    const [activeSlide, setActiveSlide] = useState(0);
    const slides = [
        {
            tag: "Premium Launch",
            title: "ELEGANCE IN THE SKIES.",
            desc: "Experience the most luxurious cabin fleet in modern aviation. Book your dream destination today.",
            img: "https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&w=1600&q=82"
        },
        {
            tag: "Global Rewards",
            title: "BEYOND BOUNDARIES.",
            desc: "Connecting 150+ international hubs with seamless transfers and premium comfort.",
            img: "https://images.unsplash.com/photo-1542332213-9b5a5a3fab35?auto=format&fit=crop&w=1600&q=82"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveSlide(s => (s + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="view">
            {/* Hero Carousel */}
            <div className="banner-carousel">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={activeSlide}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="slide active"
                        style={{ backgroundImage: `url(${slides[activeSlide].img})` }}
                    >
                        <div className="slide-overlay">
                            <div className="container">
                                <motion.span 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="section-tag"
                                >
                                    {slides[activeSlide].tag}
                                </motion.span>
                                <motion.h1 
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{ fontSize: '4.2rem', fontWeight: 950, lineHeight: 1.1, marginBottom: '2rem' }}
                                >
                                    {slides[activeSlide].title.split(' ').map((word, i) => (
                                        <span key={i} style={word === 'SKIES.' || word === 'BOUNDARIES.' ? { color: 'var(--primary)' } : {}}>
                                            {word} 
                                        </span>
                                    ))}
                                </motion.h1>
                                <motion.p 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '3rem', maxWidth: '600px' }}
                                >
                                    {slides[activeSlide].desc}
                                </motion.p>
                                <button className="btn btn-primary" style={{ padding: '1.2rem 4rem', fontSize: '1.1rem' }}>
                                    EXPLORE ROUTES <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Search Portal */}
            <div className="container" style={{ position: 'relative', zIndex: 100 }}>
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card search-portal"
                >
                    <div style={{ display: 'flex', gap: '3rem', marginBottom: '2.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.2rem' }}>
                        <button className="search-tab active">ONE WAY</button>
                        <button className="search-tab">ROUND TRIP</button>
                        <button className="search-tab">MULTI CITY</button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 0.8fr 0.8fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                        <div className="input-group">
                            <span className="input-label">Departure From</span>
                            <div className="input-field" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Plane size={18} color="var(--primary)" />
                                <span>Delhi (DEL)</span>
                            </div>
                        </div>
                        <div className="input-group">
                            <span className="input-label">Destination To</span>
                            <div className="input-field" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <MapPin size={18} color="var(--primary)" />
                                <span style={{ color: 'var(--text-muted)' }}>Enter Destination</span>
                            </div>
                        </div>
                        <div className="input-group">
                            <span className="input-label">Travel Date</span>
                            <div className="input-field" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Calendar size={18} color="var(--primary)" />
                                <span>12 Oct 2026</span>
                            </div>
                        </div>
                        <div className="input-group">
                            <span className="input-label">Travelers</span>
                            <div className="input-field" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Users size={18} color="var(--primary)" />
                                <span>1 Adult</span>
                            </div>
                        </div>
                    </div>

                    <button className="btn btn-primary" style={{ width: '100%', height: '70px', fontSize: '1.2rem', justifyContent: 'center' }}>
                        SEARCH PREMIUM FLIGHTS
                    </button>
                </motion.div>
            </div>

            {/* Trending Section */}
            <div className="container" style={{ marginTop: '8rem', marginBottom: '8rem' }}>
                <span className="section-tag">Curated Experiences</span>
                <h2 style={{ fontSize: '3rem', fontWeight: 950, marginBottom: '4rem' }}>Trending <span style={{ color: 'var(--primary)' }}>Destinations.</span></h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem' }}>
                    {[
                        { city: "Santorini, GR", price: "54,999", img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=82" },
                        { city: "Tokyo, JP", price: "82,499", img: "https://images.unsplash.com/photo-1540959733332-e94e270b2f45?auto=format&fit=crop&w=800&q=82" },
                        { city: "Maui, US", price: "76,999", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=82" }
                    ].map((dest, i) => (
                        <motion.div 
                            key={i}
                            whileHover={{ y: -10 }}
                            className="glass-card" 
                            style={{ overflow: 'hidden', borderRadius: '28px', border: 'none' }}
                        >
                            <div style={{ height: '420px', backgroundImage: `url(${dest.img})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,8,20,0.9), transparent)' }} />
                                <div style={{ position: 'absolute', bottom: '2.5rem', left: '2.5rem' }}>
                                    <h3 style={{ fontSize: '2rem', fontWeight: 950, color: '#fff', marginBottom: '5px' }}>{dest.city}</h3>
                                    <span style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '1.2rem' }}>FROM ₹{dest.price}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
