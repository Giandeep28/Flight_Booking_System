"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&w=1600&q=82",
    tag: "Premium Launch",
    title: (
      <>
        ELEGANCE IN<br /><span className="text-primary">THE SKIES.</span>
      </>
    ),
    description: "Experience the most luxurious cabin fleet in modern aviation. Book your dream destination today.",
    btnText: "EXPLORE ROUTES"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1542332213-9b5a5a3fab35?auto=format&fit=crop&w=1600&q=82",
    tag: "Global Rewards",
    title: (
      <>
        BEYOND<br /><span className="text-primary">BOUNDARIES.</span>
      </>
    ),
    description: "Connecting 150+ international hubs with seamless transfers and premium comfort.",
    btnText: "JOIN REWARDS"
  }
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[450px] bg-[#020617] overflow-hidden -mb-16">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
        >
          <div className="absolute inset-0 bg-linear-to-r from-[#000814]/95 from-0% to-transparent to-70% flex items-center">
            <div className="container pl-[10%]">
              <motion.span 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="section-tag"
              >
                {slides[currentSlide].tag}
              </motion.span>
              <motion.h1 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-[4.2rem] font-black leading-[1.1] mb-8 text-white uppercase"
              >
                {slides[currentSlide].title}
              </motion.h1>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-text-muted text-xl mb-12 max-w-[600px]"
              >
                {slides[currentSlide].description}
              </motion.p>
              <motion.button 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="btn btn-primary px-16 py-5 text-[1.1rem]"
              >
                {slides[currentSlide].btnText}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
