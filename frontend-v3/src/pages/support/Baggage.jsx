import React, { useState } from 'react';
import { FaSuitcase, FaWeight, FaBox, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const Baggage = () => {
  const [selectedClass, setSelectedClass] = useState('economy');
  const [selectedRoute, setSelectedRoute] = useState('domestic');

  const baggageAllowances = {
    economy: {
      domestic: { checked: 20, cabin: 7, pieces: 1 },
      international: { checked: 23, cabin: 7, pieces: 1 }
    },
    business: {
      domestic: { checked: 30, cabin: 10, pieces: 2 },
      international: { checked: 32, cabin: 10, pieces: 2 }
    },
    first: {
      domestic: { checked: 40, cabin: 12, pieces: 2 },
      international: { checked: 45, cabin: 12, pieces: 3 }
    }
  };

  const restrictions = [
    { item: 'Liquids over 100ml', allowed: false, note: 'Must be in checked baggage' },
    { item: 'Sharp objects', allowed: false, note: 'Knives, scissors, tools' },
    { item: 'Flammable items', allowed: false, note: 'Lighters, matches, fuel' },
    { item: 'Electronics', allowed: true, note: 'Laptops, phones allowed in cabin' },
    { item: 'Medications', allowed: true, note: 'With prescription recommended' },
    { item: 'Sports equipment', allowed: true, note: 'Special handling fees may apply' }
  ];

  const excessBaggageFees = [
    { route: 'Domestic', fee: '₹300 per kg', limit: 'Up to 32kg' },
    { route: 'International', fee: '₹500 per kg', limit: 'Up to 45kg' },
    { route: 'USA/Canada', fee: '$25 per kg', limit: 'Up to 45kg' },
    { route: 'Europe', fee: '€20 per kg', limit: 'Up to 45kg' }
  ];

  const currentAllowance = baggageAllowances[selectedClass][selectedRoute];

  return (
    <div className="baggage-page">
      {/* Calculator */}
      <div className="calculator-section">
        <h2>Baggage Allowance Calculator</h2>
        <div className="calculator-form">
          <div className="form-row">
            <div className="form-group">
              <label>Travel Class</label>
              <div className="radio-group">
                {['economy', 'business', 'first'].map((cls) => (
                  <label key={cls} className="radio-label">
                    <input
                      type="radio"
                      name="class"
                      value={cls}
                      checked={selectedClass === cls}
                      onChange={(e) => setSelectedClass(e.target.value)}
                    />
                    <span className="radio-text">{cls.charAt(0).toUpperCase() + cls.slice(1)}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Route Type</label>
              <div className="radio-group">
                {['domestic', 'international'].map((route) => (
                  <label key={route} className="radio-label">
                    <input
                      type="radio"
                      name="route"
                      value={route}
                      checked={selectedRoute === route}
                      onChange={(e) => setSelectedRoute(e.target.value)}
                    />
                    <span className="radio-text">{route.charAt(0).toUpperCase() + route.slice(1)}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Allowance Display */}
        <div className="allowance-display">
          <h3>Your Baggage Allowance</h3>
          <div className="allowance-grid">
            <div className="allowance-card">
              <FaSuitcase className="allowance-icon" />
              <h4>Checked Baggage</h4>
              <div className="allowance-details">
                <span className="weight">{currentAllowance.checked} kg</span>
                <span className="pieces">{currentAllowance.pieces} piece{currentAllowance.pieces > 1 ? 's' : ''}</span>
              </div>
            </div>
            <div className="allowance-card">
              <FaBox className="allowance-icon" />
              <h4>Cabin Baggage</h4>
              <div className="allowance-details">
                <span className="weight">{currentAllowance.cabin} kg</span>
                <span className="pieces">1 piece</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Restrictions */}
      <div className="restrictions-section">
        <h2>Prohibited & Restricted Items</h2>
        <div className="restrictions-grid">
          {restrictions.map((item, index) => (
            <div key={index} className={`restriction-card ${item.allowed ? 'allowed' : 'prohibited'}`}>
              <div className="restriction-header">
                {item.allowed ? (
                  <FaCheckCircle className="status-icon allowed" />
                ) : (
                  <FaTimesCircle className="status-icon prohibited" />
                )}
                <h3>{item.item}</h3>
              </div>
              <p>{item.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Excess Baggage */}
      <div className="excess-section">
        <h2>Excess Baggage Fees</h2>
        <div className="fees-table">
          <div className="table-header">
            <span>Route</span>
            <span>Fee</span>
            <span>Maximum Limit</span>
          </div>
          {excessBaggageFees.map((fee, index) => (
            <div key={index} className="table-row">
              <span>{fee.route}</span>
              <span className="fee-amount">{fee.fee}</span>
              <span>{fee.limit}</span>
            </div>
          ))}
        </div>
        <div className="fees-note">
          <h3>Important Notes:</h3>
          <ul>
            <li>Excess baggage charges are calculated per kg over the free allowance</li>
            <li>Pre-book excess baggage online for discounted rates</li>
            <li>Single piece should not exceed 32kg</li>
            <li>Total dimensions (L+W+H) should not exceed 158cm</li>
          </ul>
        </div>
      </div>

      {/* Special Items */}
      <div className="special-section">
        <h2>Special Baggage Items</h2>
        <div className="special-grid">
          <div className="special-card">
            <FaWeight className="special-icon" />
            <h3>Sports Equipment</h3>
            <p>Golf clubs, skis, surfboards, bicycles</p>
            <p className="special-note">Additional fees may apply</p>
          </div>
          <div className="special-card">
            <FaBox className="special-icon" />
            <h3>Musical Instruments</h3>
            <p>Guitars, violins, other instruments</p>
            <p className="special-note">Can be carried as cabin baggage if dimensions allow</p>
          </div>
          <div className="special-card">
            <FaSuitcase className="special-icon" />
            <h3>Fragile Items</h3>
            <p>Electronics, glassware, artwork</p>
            <p className="special-note">Proper packaging required</p>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="tips-section">
        <h2>Baggage Tips</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <h3>Pack Smart</h3>
            <p>Roll clothes instead of folding to save space</p>
          </div>
          <div className="tip-card">
            <h3>Weight Distribution</h3>
            <p>Distribute weight evenly in multiple bags</p>
          </div>
          <div className="tip-card">
            <h3>Label Clearly</h3>
            <p>Include name, phone, and destination address</p>
          </div>
          <div className="tip-card">
            <h3>Secure Valuables</h3>
            <p>Keep valuables in cabin baggage</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Baggage };
