import React, { useState } from 'react';
import { FaSearch, FaPlane, FaClock, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const FlightStatus = () => {
  const [flightNumber, setFlightNumber] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock flight data
  const mockFlights = [
    {
      flightNumber: 'SV-202',
      airline: 'SkyVoyage',
      departure: 'Delhi (DEL)',
      arrival: 'Mumbai (BOM)',
      scheduledDeparture: '10:30',
      scheduledArrival: '12:45',
      actualDeparture: '10:45',
      actualArrival: '12:50',
      status: 'Delayed',
      gate: 'A12',
      terminal: 'T3'
    },
    {
      flightNumber: 'SV-405',
      airline: 'SkyVoyage',
      departure: 'Bangalore (BLR)',
      arrival: 'Singapore (SIN)',
      scheduledDeparture: '14:15',
      scheduledArrival: '21:30',
      actualDeparture: '14:20',
      actualArrival: '21:25',
      status: 'On Time',
      gate: 'B24',
      terminal: 'T2'
    },
    {
      flightNumber: 'SV-118',
      airline: 'SkyVoyage',
      departure: 'Mumbai (BOM)',
      arrival: 'Dubai (DXB)',
      scheduledDeparture: '22:00',
      scheduledArrival: '00:30+1',
      actualDeparture: '22:10',
      actualArrival: '00:45+1',
      status: 'Departed',
      gate: 'C08',
      terminal: 'T2'
    },
    {
      flightNumber: 'SV-333',
      airline: 'SkyVoyage',
      departure: 'Chennai (MAA)',
      arrival: 'Kolkata (CCU)',
      scheduledDeparture: '08:00',
      scheduledArrival: '10:15',
      actualDeparture: null,
      actualArrival: null,
      status: 'Scheduled',
      gate: 'D15',
      terminal: 'T1'
    }
  ];

  const handleSearch = () => {
    if (!flightNumber.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      const results = mockFlights.filter(flight => 
        flight.flightNumber.toLowerCase().includes(flightNumber.toLowerCase())
      );
      setSearchResults(results);
      setIsSearching(false);
    }, 1000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'On Time': return 'status-green';
      case 'Delayed': return 'status-yellow';
      case 'Departed': return 'status-blue';
      case 'Scheduled': return 'status-gray';
      default: return 'status-gray';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'On Time': return <FaCheckCircle />;
      case 'Delayed': return <FaTimesCircle />;
      case 'Departed': return <FaPlane />;
      case 'Scheduled': return <FaClock />;
      default: return <FaClock />;
    }
  };

  return (
    <div className="flight-status-page">
      {/* Hero Section */}
      <section className="status-hero">
        <div className="status-hero-content">
          <FaClock className="hero-icon" />
          <h1>Flight Status</h1>
          <p>Track real-time flight status and updates</p>
        </div>
      </section>

      {/* Search Section */}
      <section className="status-search">
        <div className="container">
          <div className="search-card">
            <h2>Check Flight Status</h2>
            <div className="search-form">
              <input
                type="text"
                placeholder="Enter Flight Number (e.g., SV-202)"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flight-input"
              />
              <button 
                onClick={handleSearch}
                disabled={isSearching}
                className="search-button"
              >
                {isSearching ? (
                  <div className="spinner"></div>
                ) : (
                  <>
                    <FaSearch />
                    Search
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {searchResults.length > 0 && (
        <section className="status-results">
          <div className="container">
            <h2>Flight Information</h2>
            <div className="results-grid">
              {searchResults.map((flight, index) => (
                <div key={index} className="flight-card">
                  <div className="flight-header">
                    <div className="flight-number">
                      <span className="airline">{flight.airline}</span>
                      <span className="number">{flight.flightNumber}</span>
                    </div>
                    <div className={`flight-status ${getStatusColor(flight.status)}`}>
                      {getStatusIcon(flight.status)}
                      <span>{flight.status}</span>
                    </div>
                  </div>

                  <div className="flight-route">
                    <div className="route-point">
                      <FaMapMarkerAlt className="route-icon" />
                      <div>
                        <div className="city">{flight.departure}</div>
                        <div className="time">{flight.actualDeparture || flight.scheduledDeparture}</div>
                      </div>
                    </div>
                    <div className="route-line">
                      <FaPlane className="plane-icon" />
                    </div>
                    <div className="route-point">
                      <FaMapMarkerAlt className="route-icon" />
                      <div>
                        <div className="city">{flight.arrival}</div>
                        <div className="time">{flight.actualArrival || flight.scheduledArrival}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flight-details">
                    <div className="detail-item">
                      <span className="label">Terminal</span>
                      <span className="value">{flight.terminal}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Gate</span>
                      <span className="value">{flight.gate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quick Access */}
      <section className="quick-access">
        <div className="container">
          <h2>Popular Flight Searches</h2>
          <div className="quick-links">
            {['SV-202', 'SV-405', 'SV-118', 'SV-333'].map((flight, index) => (
              <button 
                key={index}
                onClick={() => {
                  setFlightNumber(flight);
                  handleSearch();
                }}
                className="quick-link"
              >
                {flight}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export { FlightStatus };
