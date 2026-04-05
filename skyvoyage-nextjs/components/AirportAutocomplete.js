'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Plane } from 'lucide-react';
import { airportAPI, createDebouncedAPI } from '@/lib/api';
import toast from 'react-hot-toast';

/**
 * Gateway + Python return a JSON array of airports (catalog + Amadeus + AviationStack merged).
 * Do not use fetch(promise) or expect { airports: [] } — that was dropping all real results.
 */
const AirportAutocomplete = ({
  value,
  onChange,
  placeholder = 'Enter City/Airport',
  label = 'Airport',
  id,
  className = '',
  disabled = false,
  /** Show quick links to load the full bundled India (~121) or international (~160) catalog lists */
  showBrowseChips = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const normalizeList = (data) => {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.airports)) return data.airports;
    return [];
  };

  const mapRows = (data) =>
    normalizeList(data).map((a) => ({
      ...a,
      code: a.code || a.iata_code || '',
      name: a.name || '',
      city: a.city || '',
      label:
        a.label ||
        (a.city && a.name ? `${a.city} — ${a.name} (${a.code})` : `${a.name || a.city} (${a.code})`),
    }));

  const loadByRegion = async (region) => {
    setLoading(true);
    try {
      const data = await airportAPI.search('', { region });
      const list = mapRows(data).filter((a) => a.code);
      setAirports(list);
      setSelectedIndex(-1);
      setIsOpen(true);
      inputRef.current?.focus();
    } catch (error) {
      console.error('Airport browse error:', error);
      toast.error(error.message || 'Could not load airport list');
      setAirports([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = createDebouncedAPI(async (query) => {
    if (query.length < 2) {
      setAirports([]);
      return;
    }

    setLoading(true);
    try {
      const data = await airportAPI.search(query);
      const list = mapRows(data);
      setAirports(list.filter((a) => a.code));
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Airport search error:', error);
      toast.error(error.message || 'Airport search failed');
      setAirports([]);
    } finally {
      setLoading(false);
    }
  }, 300);

  const handleInputChange = (e) => {
    const val = e.target.value;
    onChange(val);

    if (val.length >= 2) {
      debouncedSearch(val);
      setIsOpen(true);
    } else {
      setAirports([]);
      setIsOpen(false);
    }
  };

  const handleSelectAirport = (airport) => {
    const city = airport.city || airport.name || '';
    const displayValue = `${city} (${airport.code})`.replace(/^\s*\(/, '(');
    onChange(displayValue, {
      code: airport.code,
      city,
      name: airport.name || airport.label || '',
      label: airport.label,
    });
    setIsOpen(false);
    setAirports([]);
    setSelectedIndex(-1);

    if (inputRef.current) {
      inputRef.current.dataset.airportCode = airport.code;
      inputRef.current.dataset.airportData = JSON.stringify(airport);
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen || airports.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < airports.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelectAirport(airports[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`input-group ${className}`} ref={containerRef}>
      <span className="input-label">{label}</span>
      <div className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (value.length >= 2) {
                debouncedSearch(value);
                setIsOpen(true);
              } else if (airports.length > 0) {
                setIsOpen(true);
              }
            }}
            placeholder={placeholder}
            className="input-field pr-12"
            disabled={disabled}
            id={id}
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-muted">
            {loading ? (
              <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
            ) : (
              <Search size={18} />
            )}
          </div>
        </div>

        {showBrowseChips && !disabled && (
          <div className="flex flex-wrap gap-2 mt-2">
            <button
              type="button"
              className="text-[10px] uppercase tracking-wider px-2 py-1 rounded border border-primary/40 text-primary/90 hover:bg-primary/10"
              onClick={() => loadByRegion('IN')}
            >
              All Indian airports
            </button>
            <button
              type="button"
              className="text-[10px] uppercase tracking-wider px-2 py-1 rounded border border-primary/40 text-primary/90 hover:bg-primary/10"
              onClick={() => loadByRegion('INTL')}
            >
              International list
            </button>
          </div>
        )}

        {isOpen && (
          <div
            ref={dropdownRef}
            className="airport-dropdown z-50 max-h-[min(70vh,28rem)] overflow-y-auto"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '4px',
              display: 'block',
            }}
          >
            {airports.length > 0 ? (
              airports.map((airport, index) => (
                <div
                  key={`${airport.code}-${index}`}
                  className={`airport-item cursor-pointer ${
                    index === selectedIndex ? 'bg-primary/20' : ''
                  }`}
                  onClick={() => handleSelectAirport(airport)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Plane size={14} className="text-primary" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">
                        {(airport.city || airport.name || '') + ` (${airport.code})`}
                      </div>
                      <div className="text-xs text-text-muted">{airport.name || airport.label}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-primary">{airport.code}</div>
                  </div>
                </div>
              ))
            ) : loading ? (
              <div className="p-4 text-center text-text-muted">
                <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
                <div className="text-sm">Searching airports...</div>
              </div>
            ) : (
              <div className="p-4 text-center text-text-muted">
                <MapPin size={24} className="mx-auto mb-2 opacity-50" />
                <div className="text-sm">No airports found</div>
                <div className="text-xs mt-1">Try city name, IATA code, or type &quot;india&quot; / &quot;international&quot;</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AirportAutocomplete;
