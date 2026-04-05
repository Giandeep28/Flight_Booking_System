import React, { useState } from 'react';
import { FaTicketAlt, FaCheckCircle, FaClock, FaUser, FaQrcode } from 'react-icons/fa';

const CheckIn = () => {
  const [checkInData, setCheckInData] = useState({
    bookingReference: '',
    lastName: ''
  });
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const handleInputChange = (e) => {
    setCheckInData({
      ...checkInData,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckIn = (e) => {
    e.preventDefault();
    // Simulate check-in process
    setTimeout(() => {
      setIsCheckedIn(true);
    }, 1500);
  };

  const checkInSteps = [
    { step: 1, title: 'Enter Details', desc: 'Booking reference and last name', icon: FaUser },
    { step: 2, title: 'Select Seats', desc: 'Choose your preferred seats', icon: FaTicketAlt },
    { step: 3, title: 'Add Extras', desc: 'Baggage, meals, and more', icon: FaCheckCircle },
    { step: 4, title: 'Get Pass', desc: 'Download or print boarding pass', icon: FaQrcode }
  ];

  const benefits = [
    { icon: FaClock, title: 'Save Time', desc: 'Skip airport queues' },
    { icon: FaTicketAlt, title: 'Choose Seats', desc: 'Select preferred seats' },
    { icon: FaCheckCircle, title: 'Early Access', desc: 'Available 48 hours before' },
    { icon: FaQrcode, title: 'Mobile Pass', desc: 'Digital boarding pass' }
  ];

  return (
    <div className="checkin-page">
      {/* Check-in Form */}
      <div className="checkin-form-section">
        <h2>Web Check-In</h2>
        <p>Check-in online and save time at the airport</p>
        
        {!isCheckedIn ? (
          <form onSubmit={handleCheckIn} className="checkin-form">
            <div className="form-group">
              <label htmlFor="bookingReference">Booking Reference / PNR</label>
              <input
                type="text"
                id="bookingReference"
                name="bookingReference"
                value={checkInData.bookingReference}
                onChange={handleInputChange}
                placeholder="e.g., SV123456"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={checkInData.lastName}
                onChange={handleInputChange}
                placeholder="Enter your last name"
                required
              />
            </div>
            <button type="submit" className="checkin-button">
              Check-In Now
            </button>
          </form>
        ) : (
          <div className="checkin-success">
            <FaCheckCircle className="success-icon" />
            <h3>Check-In Successful!</h3>
            <p>Your boarding pass has been generated</p>
            <div className="boarding-pass-actions">
              <button className="download-button">Download Pass</button>
              <button className="email-button">Email Pass</button>
            </div>
          </div>
        )}
      </div>

      {/* Benefits */}
      <div className="benefits-section">
        <h2>Why Check-In Online?</h2>
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-card">
              <benefit.icon className="benefit-icon" />
              <h3>{benefit.title}</h3>
              <p>{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div className="steps-section">
        <h2>Check-In Process</h2>
        <div className="steps-grid">
          {checkInSteps.map((step, index) => (
            <div key={index} className="step-card">
              <div className="step-number">{step.step}</div>
              <step.icon className="step-icon" />
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Important Info */}
      <div className="info-section">
        <h2>Important Information</h2>
        <div className="info-grid">
          <div className="info-card">
            <h3>Timing</h3>
            <p>Web check-in opens 48 hours before departure and closes 2 hours before flight time</p>
          </div>
          <div className="info-card">
            <h3>Baggage</h3>
            <p>Proceed to baggage drop counter after check-in if you have checked baggage</p>
          </div>
          <div className="info-card">
            <h3>Gate Closing</h3>
            <p>Gates close 25 minutes before departure for domestic flights</p>
          </div>
          <div className="info-card">
            <h3>Documents</h3>
            <p>Carry valid ID proof and printed/mobile boarding pass to the airport</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export { CheckIn };
