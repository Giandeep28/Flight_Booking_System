'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Users, ArrowRight, Shield, CheckCircle, Plane, UserShield } from 'lucide-react';
import Header from '@/components/Header';
import AirportAutocomplete from '@/components/AirportAutocomplete';
import { flightAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function HomePage() {
  const router = useRouter();
  const [tripType, setTripType] = useState('oneway');
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    fromAirport: null,
    toAirport: null,
    departureDate: '',
    returnDate: '',
    passengers: '1',
    cabinClass: 'Economy'
  });
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Carousel data with destination images
  const slides = [
    {
      image: '/destinations/singapore.png',
      tag: 'Singapore Special',
      title: 'GARDEN CITY',
      highlight: 'ADVENTURE.',
      description: 'Experience the stunning skyline and vibrant culture of Singapore. Limited time fares available.',
      buttonText: 'BOOK NOW'
    },
    {
      image: '/destinations/mumbai.png',
      tag: 'Mumbai Express',
      title: 'BOLLYWOOD',
      highlight: 'DREAMS.',
      description: 'Discover the heart of India with non-stop flights from major cities. Experience the magic.',
      buttonText: 'EXPLORE MUMBAI'
    },
    {
      image: '/destinations/dubai.png',
      tag: 'Dubai Luxury',
      title: 'DESERT',
      highlight: 'PARADISE.',
      description: 'Fly to the city of gold with premium cabins and world-class service. Your luxury awaits.',
      buttonText: 'LUXURY FLIGHTS'
    }
  ];

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [slides.length]);

  // Handle search
  const handleSearch = async () => {
    if (!searchData.fromAirport || !searchData.toAirport) {
      toast.error('Please select departure and destination airports');
      return;
    }

    if (!searchData.departureDate) {
      toast.error('Please select departure date');
      return;
    }

    if (tripType === 'round' && !searchData.returnDate) {
      toast.error('Please select return date');
      return;
    }

    setLoading(true);

    try {
      if (tripType === 'multi') {
        toast('Multi-city search uses your first segment; book additional legs separately.', { icon: 'ℹ️' });
      }
      const searchParams = {
        from: searchData.fromAirport.code,
        to: searchData.toAirport.code,
        fromAirport: searchData.fromAirport,
        toAirport: searchData.toAirport,
        date: searchData.departureDate,
        departureDate: searchData.departureDate,
        returnDate: tripType === 'round' ? searchData.returnDate : undefined,
        passengers: searchData.passengers,
        tripType,
        cabinClass: searchData.cabinClass,
      };

      sessionStorage.setItem('flightSearchData', JSON.stringify(searchParams));
      
      // Navigate to results page
      router.push('/results');
      
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search flights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Swap airports
  const swapAirports = () => {
    setSearchData(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from,
      fromAirport: prev.toAirport,
      toAirport: prev.fromAirport
    }));
  };

  // Features data
  const features = [
    {
      icon: Shield,
      title: 'SECURE BOOKING',
      description: 'Your transactions are protected by industry-leading 256-bit encryption.'
    },
    {
      icon: CheckCircle,
      title: 'BEST FARE POLICY',
      description: 'We guarantee the lowest fares, or we\'ll refund the double difference.'
    },
    {
      icon: Plane,
      title: 'PREMIUM FLEET',
      description: 'Fly on the newest Dreamliners and A350s for maximum comfort.'
    },
    {
      icon: UserShield,
      title: '24/7 CONCIERGE',
      description: 'Get personalized assistance for any travel changes, anytime.'
    }
  ];

  // Trending destinations with actual cityscape images
  const destinations = [
    {
      city: 'Singapore',
      country: 'SG',
      image: '/destinations/singapore.png',
      price: '54,999'
    },
    {
      city: 'Mumbai',
      country: 'IN',
      image: '/destinations/mumbai.png',
      price: '32,499'
    },
    {
      city: 'Dubai',
      country: 'AE',
      image: '/destinations/dubai.png',
      price: '76,999'
    }
  ];

  return (
    <div className="view active" id="view-home">
      <Header />

      {/* Hero Carousel */}
      <div className="banner-carousel">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="slide-overlay">
              <div className="container">
                <span className="section-tag">{slide.tag}</span>
                <h1 style={{ fontSize: '4.2rem', fontWeight: '950', lineHeight: '1.1', marginBottom: '2rem' }}>
                  {slide.title}<br />
                  <span style={{ color: 'var(--primary)' }}>{slide.highlight}</span>
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '3rem', maxWidth: '600px' }}>
                  {slide.description}
                </p>
                <button className="btn btn-primary" style={{ padding: '1.2rem 4rem', fontSize: '1.1rem' }}>
                  {slide.buttonText}
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-primary w-8' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Search Portal */}
      <div className="container">
        <div 
          className="glass-card search-portal" 
          style={{ 
            background: 'rgba(5, 13, 28, 0.8)', 
            border: '1px solid var(--border)' 
          }}
        >
          {/* Trip Type Tabs */}
          <div style={{ 
            display: 'flex', 
            gap: '3rem', 
            marginBottom: '2.5rem', 
            borderBottom: '1px solid var(--border)', 
            paddingBottom: '1.2rem' 
          }}>
            {[
              { id: 'oneway', label: 'ONE WAY' },
              { id: 'round', label: 'ROUND TRIP' },
              { id: 'multi', label: 'MULTI CITY' }
            ].map((type) => (
              <button
                key={type.id}
                className={`search-tab ${tripType === type.id ? 'active' : ''}`}
                onClick={() => setTripType(type.id)}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Search Form */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: tripType === 'multi' ? '1fr 1fr 0.8fr 0.8fr 0.8fr' : '1fr 1fr 0.8fr 0.8fr', 
            gap: '1.5rem', 
            marginBottom: '2.5rem' 
          }}>
            <AirportAutocomplete
              value={searchData.from}
              onChange={(value, airport) => setSearchData(prev => ({ 
                ...prev, 
                from: value, 
                fromAirport: airport 
              }))}
              placeholder="City, IATA code, or type india"
              label="Departure From"
              id="from-input"
              showBrowseChips
            />

            <div className="relative">
              <AirportAutocomplete
                value={searchData.to}
                onChange={(value, airport) => setSearchData(prev => ({ 
                  ...prev, 
                  to: value, 
                  toAirport: airport 
                }))}
                placeholder="City, IATA code, or type international"
                label="Destination To"
                id="to-input"
                showBrowseChips
              />
              
              {/* Swap Button */}
              {tripType !== 'multi' && (
                <button
                  onClick={swapAirports}
                  className="absolute right-4 top-8 bg-primary text-dark p-2 rounded-full hover:bg-primary-dark transition-colors"
                  title="Swap airports"
                >
                  <ArrowRight size={16} className="rotate-90" />
                </button>
              )}
            </div>

            <div className="input-group">
              <span className="input-label">Travel Date</span>
              <input
                id="departure-date"
                type="date"
                value={searchData.departureDate}
                onChange={(e) => setSearchData(prev => ({ ...prev, departureDate: e.target.value }))}
                className="input-field"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {tripType === 'round' && (
              <div className="input-group">
                <span className="input-label">Return Date</span>
                <input
                  id="return-date"
                  type="date"
                  value={searchData.returnDate}
                  onChange={(e) => setSearchData(prev => ({ ...prev, returnDate: e.target.value }))}
                  className="input-field"
                  min={searchData.departureDate || new Date().toISOString().split('T')[0]}
                />
              </div>
            )}

            <div className="input-group">
              <span className="input-label">Travelers & Class</span>
              <select
                value={`${searchData.passengers}-${searchData.cabinClass}`}
                onChange={(e) => {
                  const [passengers, cabinClass] = e.target.value.split('-');
                  setSearchData(prev => ({ ...prev, passengers, cabinClass }));
                }}
                className="input-field"
              >
                <option value="1-Economy">1 Adult, Economy</option>
                <option value="2-Economy">2 Adults, Economy</option>
                <option value="1-Business">1 Adult, Business</option>
                <option value="1-First">1 Adult, First</option>
                <option value="3-Economy">3 Adults, Economy</option>
                <option value="2-Business">2 Adults, Business</option>
              </select>
            </div>
          </div>

          {/* Additional Options and Search Button */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <div style={{ display: 'flex', gap: '2.5rem' }}>
              {[
                { id: 'student', label: 'Special Student Fares' },
                { id: 'armed', label: 'Armed Forces' },
                { id: 'senior', label: 'Senior Citizen' }
              ].map((option) => (
                <label 
                  key={option.id}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    fontSize: '0.85rem', 
                    fontWeight: '700', 
                    cursor: 'pointer', 
                    color: 'var(--text-muted)' 
                  }}
                >
                  <input 
                    type="checkbox" 
                    style={{ 
                      width: '18px', 
                      height: '18px', 
                      accentColor: 'var(--primary)' 
                    }} 
                  />
                  {option.label}
                </label>
              ))}
            </div>
            
            <button 
              className="btn btn-primary" 
              style={{ 
                padding: '1.5rem 5rem', 
                fontSize: '1.2rem',
                minWidth: '250px'
              }}
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-5 h-5 border-2 border-dark border-t-transparent rounded-full" />
                  SEARCHING...
                </div>
              ) : (
                'SEARCH FLIGHTS'
              )}
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '2rem', 
          margin: '8rem 0 4rem' 
        }}>
          {features.map((feature, index) => (
            <div 
              key={index}
              className="glass-card" 
              style={{ 
                padding: '3rem 2rem', 
                textAlign: 'center', 
                background: 'rgba(5, 13, 28, 0.8)', 
                border: '1px solid var(--border)' 
              }}
            >
              <div style={{ 
                fontSize: '2.5rem', 
                color: 'var(--primary)', 
                marginBottom: '2rem' 
              }}>
                <feature.icon size={48} />
              </div>
              <h4 style={{ fontWeight: '900', marginBottom: '1rem' }}>
                {feature.title}
              </h4>
              <p style={{ 
                fontSize: '0.85rem', 
                color: 'var(--text-muted)', 
                lineHeight: '1.6' 
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Trending Destinations */}
        <div style={{ marginBottom: '10rem' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-end', 
            marginBottom: '3rem' 
          }}>
            <div>
              <span className="section-tag">Global Inspiration</span>
              <h2 style={{ fontSize: '2.8rem', fontWeight: '950' }}>
                TRENDING EXPERIENCES
              </h2>
            </div>
            <button 
              className="btn btn-outline" 
              style={{ 
                border: '1px solid var(--border)', 
                padding: '0.8rem 2rem', 
                borderRadius: '12px' 
              }}
            >
              EXPLORE ALL
            </button>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '2.5rem' 
          }}>
            {destinations.map((dest, index) => (
              <div 
                key={index}
                className="glass-card" 
                style={{ 
                  overflow: 'hidden', 
                  borderRadius: '28px', 
                  border: 'none', 
                  cursor: 'pointer' 
                }}
              >
                <div 
                  style={{ 
                    height: '420px', 
                    background: `url(${dest.image}) center/cover`, 
                    position: 'relative' 
                  }}
                >
                  <div style={{ 
                    position: 'absolute', 
                    inset: 0, 
                    background: 'linear-gradient(to top, rgba(0,8,20,0.9), transparent)' 
                  }} />
                  <div style={{ 
                    position: 'absolute', 
                    bottom: '2.5rem', 
                    left: '2.5rem' 
                  }}>
                    <h3 style={{ 
                      fontSize: '2rem', 
                      fontWeight: '950', 
                      color: '#fff', 
                      marginBottom: '5px' 
                    }}>
                      {dest.city}, {dest.country}
                    </h3>
                    <span style={{ 
                      color: 'var(--primary)', 
                      fontWeight: '900', 
                      fontSize: '1.2rem' 
                    }}>
                      FROM ₹{dest.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
