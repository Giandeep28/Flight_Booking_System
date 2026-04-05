import React, { useState } from 'react';
import { FaUndo, FaCheckCircle, FaTimesCircle, FaClock, FaMoneyBillWave } from 'react-icons/fa';

const Refund = () => {
  const [ticketType, setTicketType] = useState('refundable');
  const [timeBeforeFlight, setTimeBeforeFlight] = useState('24h');

  const refundPolicies = {
    refundable: {
      '24h+': { refund: '100%', fee: '₹0', process: 'Automatic' },
      '2-24h': { refund: '75%', fee: '₹500', process: 'Manual' },
      '0-2h': { refund: '50%', fee: '₹1000', process: 'Manual' },
      'no-show': { refund: '0%', fee: 'Full fare', process: 'No refund' }
    },
    'non-refundable': {
      '24h+': { refund: 'Credit', fee: '₹200', process: 'Credit voucher' },
      '2-24h': { refund: 'Credit', fee: '₹500', process: 'Credit voucher' },
      '0-2h': { refund: '0%', fee: 'Full fare', process: 'No refund' },
      'no-show': { refund: '0%', fee: 'Full fare', process: 'No refund' }
    },
    'special': {
      '24h+': { refund: '100%', fee: '₹0', process: 'Priority' },
      '2-24h': { refund: '90%', fee: '₹200', process: 'Priority' },
      '0-2h': { refund: '75%', fee: '₹500', process: 'Priority' },
      'no-show': { refund: '25%', fee: 'Partial fare', process: 'Manual review' }
    }
  };

  const currentPolicy = refundPolicies[ticketType][timeBeforeFlight];

  const refundSteps = [
    { step: 1, title: 'Submit Request', desc: 'Fill refund form with booking details' },
    { step: 2, title: 'Verification', desc: 'We verify your booking and eligibility' },
    { step: 3, title: 'Processing', desc: 'Refund is processed as per policy' },
    { step: 4, title: 'Credit', desc: 'Amount credited to your account' }
  ];

  const faqs = [
    {
      q: 'How long does refund processing take?',
      a: 'Refunds are typically processed within 5-7 working days for domestic flights and 7-10 working days for international flights.'
    },
    {
      q: 'Can I get a refund for a no-show?',
      a: 'No-show refunds depend on ticket type. Refundable tickets may get partial refund, while non-refundable tickets typically get no refund.'
    },
    {
      q: 'What is the cancellation fee?',
      a: 'Cancellation fees vary based on ticket type, time before departure, and route. Check the policy table above for details.'
    },
    {
      q: 'Can I get a credit note instead of refund?',
      a: 'Yes, you can opt for a credit note which is usually valid for 12 months and can be used for future bookings.'
    }
  ];

  return (
    <div className="refund-page">
      {/* Calculator */}
      <div className="calculator-section">
        <h2>Refund Policy Calculator</h2>
        <p>Check your refund eligibility based on ticket type and timing</p>
        
        <div className="calculator-form">
          <div className="form-row">
            <div className="form-group">
              <label>Ticket Type</label>
              <div className="radio-group">
                {['refundable', 'non-refundable', 'special'].map((type) => (
                  <label key={type} className="radio-label">
                    <input
                      type="radio"
                      name="ticketType"
                      value={type}
                      checked={ticketType === type}
                      onChange={(e) => setTicketType(e.target.value)}
                    />
                    <span className="radio-text">
                      {type === 'refundable' ? 'Refundable' : 
                       type === 'non-refundable' ? 'Non-Refundable' : 'Special Fare'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Time Before Flight</label>
              <div className="radio-group">
                {['24h+', '2-24h', '0-2h', 'no-show'].map((time) => (
                  <label key={time} className="radio-label">
                    <input
                      type="radio"
                      name="timeBeforeFlight"
                      value={time}
                      checked={timeBeforeFlight === time}
                      onChange={(e) => setTimeBeforeFlight(e.target.value)}
                    />
                    <span className="radio-text">
                      {time === '24h+' ? 'More than 24 hours' :
                       time === '2-24h' ? '2-24 hours' :
                       time === '0-2h' ? 'Less than 2 hours' : 'No Show'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Policy Display */}
        <div className="policy-display">
          <h3>Your Refund Details</h3>
          <div className="policy-card">
            <div className="policy-header">
              <div className="refund-percentage">
                {currentPolicy.refund === 'Credit' ? (
                  <FaMoneyBillWave className="refund-icon credit" />
                ) : (
                  <FaCheckCircle className="refund-icon" />
                )}
                <span className="percentage">{currentPolicy.refund}</span>
              </div>
              <div className="policy-info">
                <h4>Refund Amount</h4>
                <p>{currentPolicy.refund === 'Credit' ? 'Credit Voucher' : 'of fare amount'}</p>
              </div>
            </div>
            <div className="policy-details">
              <div className="detail-item">
                <span className="label">Processing Fee:</span>
                <span className="value">{currentPolicy.fee}</span>
              </div>
              <div className="detail-item">
                <span className="label">Process Type:</span>
                <span className="value">{currentPolicy.process}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Policy Table */}
      <div className="policy-table-section">
        <h2>Complete Refund Policy</h2>
        <div className="policy-table">
          <div className="table-header">
            <span>Ticket Type</span>
            <span>24h+ Before</span>
            <span>2-24h Before</span>
            <span>0-2h Before</span>
            <span>No Show</span>
          </div>
          {Object.entries(refundPolicies).map(([type, policies]) => (
            <div key={type} className="table-row">
              <span className="ticket-type">
                {type === 'refundable' ? 'Refundable' : 
                 type === 'non-refundable' ? 'Non-Refundable' : 'Special Fare'}
              </span>
              {Object.entries(policies).map(([time, policy]) => (
                <span key={time} className="policy-cell">
                  <div className="cell-content">
                    <span className="refund-amount">{policy.refund}</span>
                    <span className="fee-amount">+{policy.fee}</span>
                  </div>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Process Steps */}
      <div className="process-section">
        <h2>Refund Process</h2>
        <div className="steps-grid">
          {refundSteps.map((step, index) => (
            <div key={index} className="step-card">
              <div className="step-number">{step.step}</div>
              <FaUndo className="step-icon" />
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Important Notes */}
      <div className="notes-section">
        <h2>Important Information</h2>
        <div className="notes-grid">
          <div className="note-card">
            <FaClock className="note-icon" />
            <h3>Processing Time</h3>
            <p>Domestic: 5-7 working days</p>
            <p>International: 7-10 working days</p>
          </div>
          <div className="note-card">
            <FaMoneyBillWave className="note-icon" />
            <h3>Refund Mode</h3>
            <p>Same mode as payment (credit/debit card, net banking, etc.)</p>
          </div>
          <div className="note-card">
            <FaCheckCircle className="note-icon" />
            <h3>Partial Refunds</h3>
            <p>Applicable for cancellations made within specified time frames</p>
          </div>
          <div className="note-card">
            <FaTimesCircle className="note-icon" />
            <h3>No Refund Cases</h3>
            <p>Government taxes, fuel surcharges, and convenience fees are non-refundable</p>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <h3>{faq.q}</h3>
              <p>{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { Refund };
