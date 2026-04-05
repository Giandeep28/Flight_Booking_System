'use client';

import { useState, useEffect } from 'react';
import { Users, Luggage, Wifi, Utensils, Bolt } from 'lucide-react';

const SeatMap = ({ flightId, onSeatSelect, cabinClass = 'Economy' }) => {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Generate seat layout based on cabin class
  const generateSeatLayout = () => {
    const layouts = {
      'Economy': { rows: 20, seatsPerRow: 6, price: 0 },
      'Business': { rows: 8, seatsPerRow: 4, price: 5000 },
      'First': { rows: 4, seatsPerRow: 2, price: 10000 }
    };
    
    const layout = layouts[cabinClass] || layouts['Economy'];
    const seatArray = [];
    
    for (let row = 1; row <= layout.rows; row++) {
      for (let seat = 1; seat <= layout.seatsPerRow; seat++) {
        const seatNumber = `${String.fromCharCode(64 + row)}${seat}`;
        const isAisle = seat === 3 || seat === 4;
        
        seatArray.push({
          id: `${flightId}-${seatNumber}`,
          number: seatNumber,
          row,
          seat,
          type: isAisle ? 'aisle' : (seat <= 2 ? 'window' : 'middle'),
          status: Math.random() > 0.8 ? 'occupied' : 'available',
          price: layout.price + (row <= 5 ? 2000 : row <= 10 ? 1000 : 0),
          cabinClass
        });
      }
    }
    
    return seatArray;
  };

  useEffect(() => {
    // Simulate loading seat data
    const timer = setTimeout(() => {
      setSeats(generateSeatLayout());
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [flightId, cabinClass]);

  const handleSeatClick = (seat) => {
    if (seat.status === 'occupied' || seat.type === 'aisle') return;
    
    const isSelected = selectedSeats.find(s => s.id === seat.id);
    
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleConfirmSelection = () => {
    if (selectedSeats.length > 0) {
      onSeatSelect(selectedSeats[0]); // For now, select first seat
    }
  };

  const getSeatIcon = (seat) => {
    if (seat.type === 'aisle') return null;
    
    if (seat.status === 'occupied') {
      return '❌';
    }
    
    if (selectedSeats.find(s => s.id === seat.id)) {
      return '✅';
    }
    
    return '💺';
  };

  const getSeatClass = (seat) => {
    if (seat.type === 'aisle') return 'seat-aisle';
    
    let baseClass = 'seat';
    
    if (seat.status === 'occupied') {
      baseClass += ' occupied';
    } else if (selectedSeats.find(s => s.id === seat.id)) {
      baseClass += ' selected';
    } else {
      baseClass += ' available';
    }
    
    if (seat.type === 'window') baseClass += ' window';
    if (seat.type === 'middle') baseClass += ' middle';
    
    return baseClass;
  };

  const getTotalPrice = () => {
    return selectedSeats.reduce((total, seat) => total + seat.price, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border border-border rounded bg-gray-700"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border border-border rounded bg-primary text-dark flex items-center justify-center text-xs">💺</div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border border-border rounded bg-red-900 text-red-400 flex items-center justify-center text-xs">❌</div>
          <span>Occupied</span>
        </div>
      </div>

      {/* Seat Map */}
      <div className="glass-card p-6" style={{ background: 'rgba(5, 13, 28, 0.8)' }}>
        <div className="mb-4 text-center">
          <div className="inline-flex items-center gap-4 text-xs text-text-muted">
            <div className="flex items-center gap-1">
              <div className="w-8 h-4 bg-primary rounded"></div>
              <span>Window</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-8 h-4 bg-gray-600 rounded"></div>
              <span>Middle</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-16 h-4 bg-gray-800"></div>
              <span>Aisle</span>
            </div>
          </div>
        </div>

        <div className="seat-map">
          {Array.from({ length: Math.ceil(seats.length / 6) }, (_, rowIndex) => (
            <div key={rowIndex} className="seat-row flex items-center justify-center gap-2 mb-2">
              <div className="text-xs text-text-muted w-4">
                {String.fromCharCode(65 + rowIndex)}
              </div>
              
              {seats.slice(rowIndex * 6, (rowIndex + 1) * 6).map((seat) => (
                <div key={seat.id} className="relative">
                  <button
                    onClick={() => handleSeatClick(seat)}
                    className={getSeatClass(seat)}
                    disabled={seat.status === 'occupied' || seat.type === 'aisle'}
                    title={`Seat ${seat.number} - ${seat.status === 'occupied' ? 'Occupied' : 'Available'}${seat.price > 0 ? ` - +₹${seat.price}` : ''}`}
                  >
                    {getSeatIcon(seat)}
                  </button>
                  
                  {seat.price > 0 && seat.status !== 'occupied' && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-primary whitespace-nowrap">
                      +₹{seat.price}
                    </div>
                  )}
                </div>
              ))}
              
              <div className="text-xs text-text-muted w-4">
                {String.fromCharCode(65 + rowIndex)}
              </div>
            </div>
          ))}
        </div>

        {/* Front indicator */}
        <div className="mt-4 text-center">
          <div className="inline-block px-4 py-1 bg-primary text-dark text-xs font-bold rounded">
            FRONT
          </div>
        </div>
      </div>

      {/* Selection Summary */}
      {selectedSeats.length > 0 && (
        <div className="glass-card p-6" style={{ background: 'rgba(5, 13, 28, 0.8)' }}>
          <h3 className="font-black text-lg mb-4">Seat Selection Summary</h3>
          
          <div className="space-y-2 mb-4">
            {selectedSeats.map((seat) => (
              <div key={seat.id} className="flex justify-between items-center py-2 border-b border-border">
                <div>
                  <span className="font-bold">Seat {seat.number}</span>
                  <span className="text-text-muted ml-2">
                    ({seat.type === 'window' ? 'Window' : seat.type === 'middle' ? 'Middle' : 'Aisle'})
                  </span>
                </div>
                <div className="text-primary font-bold">
                  {seat.price > 0 ? `+₹${seat.price}` : 'Included'}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-bold">Total Additional Cost:</span>
            <span className="text-xl font-black text-primary">
              ₹{getTotalPrice().toLocaleString()}
            </span>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedSeats([])}
              className="btn btn-outline"
            >
              Clear Selection
            </button>
            <button
              onClick={handleConfirmSelection}
              className="btn btn-primary"
            >
              Confirm Seat Selection
            </button>
          </div>
        </div>
      )}

      {/* Amenities Information */}
      <div className="glass-card p-6" style={{ background: 'rgba(5, 13, 28, 0.8)' }}>
        <h3 className="font-black text-lg mb-4">Cabin Amenities</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
            <Wifi size={20} className="text-primary" />
            <div>
              <div className="font-bold text-sm">WiFi</div>
              <div className="text-xs text-text-muted">Available</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
            <Utensils size={20} className="text-primary" />
            <div>
              <div className="font-bold text-sm">Meals</div>
              <div className="text-xs text-text-muted">Complimentary</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
            <Bolt size={20} className="text-primary" />
            <div>
              <div className="font-bold text-sm">Power</div>
              <div className="text-xs text-text-muted">USB Ports</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
            <Luggage size={20} className="text-primary" />
            <div>
              <div className="font-bold text-sm">Baggage</div>
              <div className="text-xs text-text-muted">20kg Included</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .seat-map {
          max-width: 600px;
          margin: 0 auto;
        }
        
        .seat-row {
          min-height: 40px;
        }
        
        .seat {
          width: 32px;
          height: 32px;
          border: 1px solid var(--border);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }
        
        .seat.available {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text);
        }
        
        .seat.available:hover {
          background: var(--primary);
          color: var(--dark);
          transform: scale(1.1);
        }
        
        .seat.selected {
          background: var(--primary);
          color: var(--dark);
          border-color: var(--primary);
        }
        
        .seat.occupied {
          background: rgba(239, 68, 68, 0.2);
          color: var(--text-muted);
          cursor: not-allowed;
          border-color: rgba(239, 68, 68, 0.3);
        }
        
        .seat.aisle {
          width: 16px;
          background: transparent;
          border: none;
          cursor: default;
        }
        
        .seat.window {
          border-left: 2px solid var(--primary);
        }
        
        .seat.middle {
          border-left: 1px solid var(--border);
          border-right: 1px solid var(--border);
        }
      `}</style>
    </div>
  );
};

export default SeatMap;
