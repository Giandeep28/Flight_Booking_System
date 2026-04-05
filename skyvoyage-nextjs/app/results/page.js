'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Filter, ChevronDown } from 'lucide-react';
import Header from '@/components/Header';
import { flightAPI } from '@/lib/api';
import { formatMoney } from '@/lib/formatMoney';
import toast from 'react-hot-toast';

function normalizeFlight(f, searchData) {
  const code = f.airline_code || 'XX';
  const logo =
    f.airline_logo_url ||
    f.airline_logo ||
    `https://www.gstatic.com/flights/airline_logos/70px/${code}.png`;
  const dm = f.duration_minutes != null ? f.duration_minutes : null;
  let durationStr = f.duration;
  if (dm != null && dm >= 0) {
    durationStr = `${Math.floor(dm / 60)}h ${dm % 60}m`;
  }
  return {
    ...f,
    raw_offer: f.raw_offer ?? f.rawOffer,
    airline_name: f.airline_name || f.airline || code,
    airline_code: code,
    airline_logo: logo,
    duration: durationStr || '—',
    duration_minutes: dm ?? (typeof f.duration_minutes === 'number' ? f.duration_minutes : 0),
    price: typeof f.price === 'number' ? f.price : parseFloat(f.price) || 0,
    departure_airport: {
      city: searchData?.fromAirport?.city || f.origin,
      code: searchData?.fromAirport?.code || f.origin,
    },
    arrival_airport: {
      city: searchData?.toAirport?.city || f.destination,
      code: searchData?.toAirport?.code || f.destination,
    },
  };
}

// Loading skeleton component
const FlightSkeleton = () => (
  <div className="glass-card animate-pulse" style={{ 
    padding: '2.5rem 3.5rem', 
    marginBottom: '1.5rem',
    background: 'rgba(5, 13, 28, 0.8)',
    border: '1px solid var(--border)'
  }}>
    <div className="grid grid-cols-5 gap-8 items-center">
      <div className="flex items-center gap-5">
        <div className="w-12 h-12 bg-gray-700 rounded-lg"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-700 rounded w-24"></div>
          <div className="h-3 bg-gray-700 rounded w-16"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-6 bg-gray-700 rounded w-16"></div>
        <div className="h-3 bg-gray-700 rounded w-12"></div>
      </div>
      <div className="text-center space-y-2">
        <div className="h-4 bg-gray-700 rounded w-20 mx-auto"></div>
        <div className="h-1 bg-gray-700 rounded w-16 mx-auto"></div>
        <div className="h-3 bg-gray-700 rounded w-12 mx-auto"></div>
      </div>
      <div className="text-right space-y-2">
        <div className="h-6 bg-gray-700 rounded w-16 ml-auto"></div>
        <div className="h-3 bg-gray-700 rounded w-12 ml-auto"></div>
      </div>
      <div className="text-right space-y-3">
        <div className="h-8 bg-gray-700 rounded w-24 ml-auto"></div>
        <div className="h-12 bg-gray-700 rounded w-full"></div>
      </div>
    </div>
  </div>
);

function ResultsContent() {
  const router = useRouter();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState(null);
  const [filters, setFilters] = useState({
    stops: 'all',
    airlines: [],
    priceRange: [0, 50000],
    departureTime: 'all',
    duration: 'all'
  });
  const [sortBy, setSortBy] = useState('recommended');
  const [showFilters, setShowFilters] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [liveMeta, setLiveMeta] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedSearchData = sessionStorage.getItem('flightSearchData');
        if (!savedSearchData) {
          router.push('/');
          return;
        }

        const searchParams = JSON.parse(savedSearchData);
        setSearchData(searchParams);

        const response = await flightAPI.search(searchParams);
        const raw = response.flights || [];
        setSearchError(response.error || null);
        setLiveMeta({
          cached: !!response.cached,
          live_sources: response.live_sources || [],
          pricing_source: response.pricing_source,
          dataset: response.dataset,
        });
        if (raw.length === 0 && response.error) {
          toast.error(String(response.error));
        }
        setFlights(raw.map((f) => normalizeFlight(f, searchParams)));
      } catch (error) {
        console.error('Error loading flights:', error);
        setSearchError(error.message || 'Search failed');
        toast.error('Failed to load flight results');
        setFlights([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  // Filter and sort flights
  const getFilteredFlights = () => {
    let filtered = [...flights];

    // Apply filters
    if (filters.stops !== 'all') {
      filtered = filtered.filter(flight => {
        if (filters.stops === 'nonstop') return flight.stops === 0;
        if (filters.stops === '1stop') return flight.stops === 1;
        if (filters.stops === '2plus') return flight.stops >= 2;
        return true;
      });
    }

    if (filters.airlines.length > 0) {
      filtered = filtered.filter(flight => 
        filters.airlines.includes(flight.airline_code)
      );
    }

    if (filters.priceRange[1] < 50000) {
      filtered = filtered.filter(flight => 
        flight.price >= filters.priceRange[0] && flight.price <= filters.priceRange[1]
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'cheapest':
        filtered.sort((a, b) => {
          const pa = a.price > 0 ? a.price : Number.MAX_SAFE_INTEGER;
          const pb = b.price > 0 ? b.price : Number.MAX_SAFE_INTEGER;
          return pa - pb;
        });
        break;
      case 'fastest':
        filtered.sort((a, b) => (a.duration_minutes || 0) - (b.duration_minutes || 0));
        break;
      case 'earliest':
        filtered.sort((a, b) => {
          const ta = String(a.departure_time || '').replace(':', '');
          const tb = String(b.departure_time || '').replace(':', '');
          return parseInt(ta, 10) - parseInt(tb, 10);
        });
        break;
      default: // recommended — bookable Amadeus/Duffel first, then price/stops
        filtered.sort((a, b) => {
          const ba =
            (a.raw_source === 'amadeus' || a.raw_source === 'duffel') && a.price > 0 ? 0 : 1;
          const bb =
            (b.raw_source === 'amadeus' || b.raw_source === 'duffel') && b.price > 0 ? 0 : 1;
          if (ba !== bb) return ba - bb;
          const pa = a.price > 0 ? a.price : 1e12;
          const pb = b.price > 0 ? b.price : 1e12;
          return pa + a.stops * 2000 - (pb + b.stops * 2000);
        });
    }

    return filtered;
  };

  const filteredFlights = getFilteredFlights();

  const handleFlightSelect = (flight) => {
    const bookable =
      (flight.raw_source === 'amadeus' || flight.raw_source === 'duffel') && flight.price > 0;
    if (!bookable) {
      toast.error(
        'Schedule-only or no fare. Choose a row priced by Amadeus or Duffel to book and pay.'
      );
      return;
    }
    sessionStorage.setItem('selectedFlight', JSON.stringify(flight));
    router.push('/booking');
  };

  const formatTime = (time) => {
    if (!time || typeof time !== 'string') return '—';
    const part = time.includes('T') ? time.substring(11, 16) : time.substring(0, 5);
    const [hours, minutes] = part.split(':');
    const hour = parseInt(hours, 10);
    if (Number.isNaN(hour)) return time;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes || '00'} ${ampm}`;
  };

  const formatDuration = (duration) => {
    if (!duration || duration === '—') return '—';
    return String(duration);
  };

  if (loading) {
    return (
      <div className="view active">
        <Header />
        <div className="container">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-3">
              <div className="glass-card p-6 animate-pulse" style={{ background: 'rgba(5, 13, 28, 0.8)' }}>
                <div className="h-6 bg-gray-700 rounded mb-6"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
            <div className="col-span-9">
              <div className="space-y-4">
                <FlightSkeleton />
                <FlightSkeleton />
                <FlightSkeleton />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="view active">
      <Header />
      
      <div className="container">
        <div className="grid grid-cols-12 gap-6">
          {/* Filters Sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <div className="glass-card p-6 sticky top-24" style={{ background: 'rgba(5, 13, 28, 0.8)' }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black tracking-wide">FILTERS</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden text-primary"
                >
                  <Filter size={20} />
                </button>
              </div>

              <div className={`${showFilters ? 'block' : 'hidden lg:block'} space-y-6`}>
                {/* Stops Filter */}
                <div>
                  <span className="input-label">Stops Count</span>
                  <div className="flex flex-col gap-3 mt-4">
                    {[
                      { value: 'all', label: 'All Flights' },
                      { value: 'nonstop', label: 'Non-Stop' },
                      { value: '1stop', label: '1 Stop' },
                      { value: '2plus', label: '2+ Stops' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-3 text-sm font-medium cursor-pointer">
                        <input
                          type="radio"
                          name="stops"
                          value={option.value}
                          checked={filters.stops === option.value}
                          onChange={(e) => setFilters(prev => ({ ...prev, stops: e.target.value }))}
                          className="w-4 h-4 text-primary"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Airlines Filter */}
                <div>
                  <span className="input-label">Airlines</span>
                  <div className="flex flex-col gap-3 mt-4">
                    {Array.from(new Set(flights.map((f) => f.airline_code).filter(Boolean))).map((code) => {
                      const row = flights.find((f) => f.airline_code === code);
                      const label = row?.airline_name || code;
                      return (
                        <label key={code} className="flex items-center gap-3 text-sm font-medium cursor-pointer">
                          <input
                            type="checkbox"
                            value={code}
                            checked={filters.airlines.includes(code)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilters((prev) => ({
                                  ...prev,
                                  airlines: [...prev.airlines, code],
                                }));
                              } else {
                                setFilters((prev) => ({
                                  ...prev,
                                  airlines: prev.airlines.filter((a) => a !== code),
                                }));
                              }
                            }}
                          />
                          <span>{label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <span className="input-label">Price Range</span>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-text-muted mb-2">
                      <span>₹{filters.priceRange[0].toLocaleString()}</span>
                      <span>₹{filters.priceRange[1].toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      value={filters.priceRange[1]}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        priceRange: [prev.priceRange[0], parseInt(e.target.value)] 
                      }))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="col-span-12 lg:col-span-9">
            {/* Results Header */}
            <div className="glass-card p-4 mb-4" style={{ background: 'rgba(5, 13, 28, 0.8)' }}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="font-black text-lg text-primary">
                    {filteredFlights.length} FLIGHTS FOUND
                  </h2>
                  {searchData && (
                    <p className="text-sm text-text-muted mt-1">
                      {searchData.fromAirport?.city || searchData.from} to{' '}
                      {searchData.toAirport?.city || searchData.to} •{' '}
                      {searchData.departureDate || searchData.date}
                    </p>
                  )}
                  {searchError && (
                    <p className="text-xs text-amber-400 mt-1">{searchError}</p>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-text-muted">Sort by:</span>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="input-field py-2 px-4 pr-10 text-sm appearance-none"
                      style={{ background: 'rgba(255,255,255,0.05)' }}
                    >
                      <option value="recommended">Recommended</option>
                      <option value="cheapest">Cheapest</option>
                      <option value="fastest">Fastest</option>
                      <option value="earliest">Earliest Departure</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {liveMeta && (
              <div
                className="glass-card p-4 mb-4 text-sm"
                style={{
                  background: 'rgba(197, 160, 89, 0.08)',
                  border: '1px solid rgba(197, 160, 89, 0.25)',
                }}
              >
                {liveMeta.cached ? (
                  <p className="text-text-muted">
                    Showing <strong>cached</strong> live API results. Run a new search for the latest fares.
                  </p>
                ) : (
                  <p>
                    <strong className="text-primary">Live aviation dataset</strong>
                    {liveMeta.pricing_source === 'live_offer_apis'
                      ? ' — Bookable fares from live offer APIs (Amadeus Flight Offers and/or Duffel NDC).'
                      : ' — Schedule-style data only; add Amadeus and/or Duffel for real fares and booking.'}
                    {liveMeta.live_sources?.length > 0 && (
                      <span className="text-text-muted">
                        {' '}
                        Feeds: {liveMeta.live_sources.join(', ')}.
                      </span>
                    )}
                  </p>
                )}
              </div>
            )}

            {/* Flight List */}
            <div className="space-y-4">
              {filteredFlights.length === 0 ? (
                <div className="glass-card p-12 text-center" style={{ background: 'rgba(5, 13, 28, 0.8)' }}>
                  <div className="text-6xl mb-4">✈️</div>
                  <h3 className="text-xl font-black mb-2">No flights found</h3>
                  <p className="text-text-muted mb-6">Try adjusting your filters or search criteria</p>
                  <button 
                    onClick={() => router.push('/')}
                    className="btn btn-primary"
                  >
                    <ArrowLeft size={16} />
                    Back to Search
                  </button>
                </div>
              ) : (
                filteredFlights.map((flight) => (
                  <div 
                    key={flight.id}
                    className="glass-card hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
                    style={{ 
                      padding: '2.5rem 3.5rem', 
                      background: 'rgba(5, 13, 28, 0.8)',
                      border: '1px solid var(--border)'
                    }}
                    onClick={() => handleFlightSelect(flight)}
                  >
                    <div className="grid grid-cols-5 gap-8 items-center">
                      {/* Airline Info */}
                      <div className="flex items-center gap-5">
                        <img 
                          src={flight.airline_logo} 
                          alt={flight.airline_name}
                          className="w-12 h-12 object-contain"
                          style={{ filter: 'brightness(1.2)' }}
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${flight.airline_code}&background=C5A059&color=000814&size=48`;
                          }}
                        />
                        <div>
                          <div className="font-bold text-text-muted text-sm">
                            {flight.airline_name}
                          </div>
                          <div className="text-xs text-text-muted">
                            {flight.flight_number}
                          </div>
                          {flight.raw_source && (
                            <div className="text-[10px] uppercase tracking-wider text-primary/80 mt-1">
                              {flight.raw_source === 'amadeus'
                                ? 'Amadeus fare'
                                : flight.raw_source === 'duffel'
                                  ? 'Duffel live offer'
                                  : 'Schedule'}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Departure */}
                      <div>
                        <div className="font-black text-2xl">
                          {formatTime(flight.departure_time)}
                        </div>
                        <div className="text-sm font-bold text-text-muted">
                          {searchData?.fromAirport?.code || 'DEL'}
                        </div>
                      </div>

                      {/* Duration & Stops */}
                      <div className="text-center">
                        <div className="text-sm text-text-muted mb-2">
                          {formatDuration(flight.duration)}
                        </div>
                        <div className="relative">
                          <div className="h-0.5 w-16 bg-border mx-auto relative">
                            <div className="absolute w-2 h-2 bg-primary rounded-full -top-1.5 left-1/2 transform -translate-x-1/2"></div>
                          </div>
                          <div className="text-xs font-black text-primary mt-2">
                            {flight.stops === 0 ? 'NON-STOP' : `${flight.stops} STOP${flight.stops > 1 ? 'S' : ''}`}
                          </div>
                        </div>
                      </div>

                      {/* Arrival */}
                      <div className="text-right">
                        <div className="font-black text-2xl">
                          {formatTime(flight.arrival_time)}
                        </div>
                        <div className="text-sm font-bold text-text-muted">
                          {searchData?.toAirport?.code || 'BOM'}
                        </div>
                      </div>

                      {/* Price & Book */}
                      <div className="text-right">
                        <div className="text-3xl font-black text-primary mb-3">
                          {flight.price > 0
                            ? formatMoney(flight.price, flight.currency || 'INR')
                            : 'Fare N/A'}
                        </div>
                        {!(
                          (flight.raw_source === 'amadeus' || flight.raw_source === 'duffel') &&
                          flight.price > 0
                        ) && (
                          <div className="text-[10px] text-amber-400/90 mb-2 max-w-[140px] ml-auto">
                            Not bookable here — pick Amadeus or Duffel priced row
                          </div>
                        )}
                        <button 
                          className="btn btn-primary w-full rounded-xl"
                          style={{ height: '55px', fontSize: '1rem' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFlightSelect(flight);
                          }}
                        >
                          SECURE SEAT
                        </button>
                      </div>
                    </div>

                    {/* Amenities */}
                    {flight.amenities && flight.amenities.length > 0 && (
                      <div className="flex gap-6 mt-4 pt-4 border-t border-border">
                        {flight.amenities.slice(0, 3).map((amenity, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs text-text-muted">
                            <amenity.icon size={14} className="text-primary" />
                            {amenity.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="view active">
        <Header />
        <div className="container flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
