'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ArrowLeft, User, Phone, Mail, CreditCard, Shield, Check, AlertCircle, Calendar, MapPin } from 'lucide-react';
import Header from '@/components/Header';
import { bookingAPI } from '@/lib/api';
import { formatMoney } from '@/lib/formatMoney';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

// Dynamic import for SeatMap component
const SeatMap = dynamic(() => import('@/components/SeatMap'), {
  loading: () => <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />,
  ssr: false
});

function BookingContent() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [searchInfo, setSearchInfo] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    passengerName: '',
    passengerEmail: '',
    passengerPhone: '',
    dob: '',
    gender: '',
    nationality: '',
    passportNumber: '',
    specialRequests: '',
    seatNumber: '',
    cabinClass: 'Economy',
    baggageInfo: '20kg'
  });
  const [paymentData, setPaymentData] = useState({
    method: 'credit-card',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
    saveCard: false
  });
  const [loading, setLoading] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingPNR, setBookingPNR] = useState('');
  const [selectedSeat, setSelectedSeat] = useState(null);

  useEffect(() => {
    const savedFlight = sessionStorage.getItem('selectedFlight');
    const savedSearch = sessionStorage.getItem('flightSearchData');
    let parsedSearch = null;
    if (savedSearch) {
      try {
        parsedSearch = JSON.parse(savedSearch);
        setSearchInfo(parsedSearch);
      } catch {
        /* ignore */
      }
    }
    if (savedFlight) {
      const flight = JSON.parse(savedFlight);
      const bookable =
        (flight.raw_source === 'amadeus' || flight.raw_source === 'duffel') &&
        flight.price > 0;
      if (!bookable) {
        toast.error('This itinerary is not bookable. Choose an Amadeus or Duffel priced flight.');
        router.push('/results');
        return;
      }
      setSelectedFlight(flight);
      setBookingData((prev) => ({
        ...prev,
        cabinClass: flight.cabin_class || parsedSearch?.cabinClass || 'Economy',
      }));
    } else {
      router.push('/results');
    }

    if (user) {
      setBookingData((prev) => ({
        ...prev,
        passengerName: user.name || '',
        passengerEmail: user.email || '',
      }));
    }
  }, [user, router]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth?redirect=/booking');
    }
  }, [authLoading, user, router]);

  const handlePassengerSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!bookingData.passengerName || !bookingData.passengerEmail || !bookingData.passengerPhone) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!bookingData.dob) {
      toast.error('Please select your date of birth');
      return;
    }

    setCurrentStep(2);
  };

  const handleSeatSelection = (seat) => {
    setSelectedSeat(seat);
    setBookingData(prev => ({
      ...prev,
      seatNumber: seat.number
    }));
    setCurrentStep(3);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    const cardMethods = ['credit-card', 'debit-card'];
    if (cardMethods.includes(paymentData.method)) {
      if (!paymentData.cardNumber || !paymentData.cardName || !paymentData.cardExpiry || !paymentData.cardCvv) {
        toast.error('Please fill all card details');
        return;
      }
    }

    setLoading(true);

    try {
      const bookingPayload = {
        flightOffer: {
          ...selectedFlight,
          price: selectedFlight.price,
          currency: selectedFlight.currency || 'INR',
        },
        passengers: [
          {
            name: bookingData.passengerName,
            email: bookingData.passengerEmail,
            phone: bookingData.passengerPhone,
            dob: bookingData.dob,
            gender: bookingData.gender,
            nationality: bookingData.nationality,
            passportNumber: bookingData.passportNumber,
          },
        ],
        seatMap: { seat: bookingData.seatNumber || selectedSeat?.number },
        addons: {
          baggage: bookingData.baggageInfo,
          specialRequests: bookingData.specialRequests,
        },
        totalAmount: selectedFlight.price,
        currency: selectedFlight.currency || 'INR',
      };

      const booking = await bookingAPI.create(bookingPayload);

      setBookingPNR(booking.pnr);
      setBookingComplete(true);
      setCurrentStep(4);
      sessionStorage.removeItem('selectedFlight');
      sessionStorage.removeItem('flightSearchData');
      if (booking.booking_mode === 'amadeus_live') {
        toast.success('Booking confirmed with airline (Amadeus live order).');
      } else {
        toast.success('Booking confirmed (simulated PNR — use Amadeus offers for live ticketing).');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.message || 'Failed to complete booking.');
    } finally {
      setLoading(false);
    }
  };

  const fareCurrency = selectedFlight?.currency || 'INR';
  const formatFare = (price) => formatMoney(price, fareCurrency);

  if (authLoading || !user || !selectedFlight) {
    return (
      <div className="view active">
        <Header />
        <div className="container flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="view active">
      <Header />
      
      <div className="container py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center max-w-3xl mx-auto">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                  currentStep >= step 
                    ? 'bg-primary text-dark' 
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {step < 4 ? step : <Check size={16} />}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 ${
                    currentStep > step ? 'bg-primary' : 'bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center max-w-3xl mx-auto mt-4 gap-8 text-sm">
            <span className={currentStep >= 1 ? 'text-primary font-bold' : 'text-text-muted'}>
              Passenger Info
            </span>
            <span className={currentStep >= 2 ? 'text-primary font-bold' : 'text-text-muted'}>
              Seat Selection
            </span>
            <span className={currentStep >= 3 ? 'text-primary font-bold' : 'text-text-muted'}>
              Payment
            </span>
            <span className={currentStep >= 4 ? 'text-primary font-bold' : 'text-text-muted'}>
              Confirmation
            </span>
          </div>
        </div>

        {/* Flight Summary */}
        <div className="glass-card p-6 mb-8" style={{ background: 'rgba(5, 13, 28, 0.8)' }}>
          <h3 className="font-black text-xl mb-4">Flight Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <img 
                  src={selectedFlight.airline_logo || selectedFlight.airline_logo_url} 
                  alt={selectedFlight.airline_name}
                  className="w-10 h-10 object-contain"
                  style={{ filter: 'brightness(1.2)' }}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${selectedFlight.airline_code}&background=C5A059&color=000814&size=48`;
                  }}
                />
                <div>
                  <div className="font-bold">{selectedFlight.airline_name}</div>
                  <div className="text-sm text-text-muted">{selectedFlight.flight_number}</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-primary" />
                  <span>
                    {selectedFlight.departure_airport?.city || searchInfo?.fromAirport?.city} (
                    {selectedFlight.departure_airport?.code || searchInfo?.fromAirport?.code})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-primary" />
                  <span>
                    {searchInfo?.departureDate || searchInfo?.date
                      ? new Date((searchInfo.departureDate || searchInfo.date) + 'T12:00:00').toLocaleDateString()
                      : '—'}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-primary mb-2">
                {formatFare(selectedFlight.price)}
              </div>
              <div className="text-sm text-text-muted">
                {(bookingData.cabinClass || selectedFlight.cabin_class || 'Economy')} Class
              </div>
              {selectedSeat && (
                <div className="text-sm text-text-muted mt-2">
                  Seat: {selectedSeat.number}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Step 1: Passenger Information */}
        {currentStep === 1 && (
          <div className="max-w-2xl mx-auto">
            <div className="glass-card p-8" style={{ background: 'rgba(5, 13, 28, 0.8)' }}>
              <h2 className="font-black text-2xl mb-6">Passenger Information</h2>
              
              <form onSubmit={handlePassengerSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="input-label">Full Name *</label>
                    <input
                      type="text"
                      value={bookingData.passengerName}
                      onChange={(e) => setBookingData(prev => ({ ...prev, passengerName: e.target.value }))}
                      className="input-field"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="input-label">Email Address *</label>
                    <input
                      type="email"
                      value={bookingData.passengerEmail}
                      onChange={(e) => setBookingData(prev => ({ ...prev, passengerEmail: e.target.value }))}
                      className="input-field"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="input-label">Phone Number *</label>
                    <input
                      type="tel"
                      value={bookingData.passengerPhone}
                      onChange={(e) => setBookingData(prev => ({ ...prev, passengerPhone: e.target.value }))}
                      className="input-field"
                      placeholder="+1234567890"
                      required
                    />
                  </div>
                  <div>
                    <label className="input-label">Date of Birth *</label>
                    <input
                      type="date"
                      value={bookingData.dob}
                      onChange={(e) => setBookingData(prev => ({ ...prev, dob: e.target.value }))}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="input-label">Gender</label>
                    <select
                      value={bookingData.gender}
                      onChange={(e) => setBookingData(prev => ({ ...prev, gender: e.target.value }))}
                      className="input-field"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="input-label">Nationality</label>
                    <input
                      type="text"
                      value={bookingData.nationality}
                      onChange={(e) => setBookingData(prev => ({ ...prev, nationality: e.target.value }))}
                      className="input-field"
                      placeholder="Indian"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="input-label">Special Requests</label>
                  <textarea
                    value={bookingData.specialRequests}
                    onChange={(e) => setBookingData(prev => ({ ...prev, specialRequests: e.target.value }))}
                    className="input-field"
                    rows={3}
                    placeholder="Meal preferences, wheelchair assistance, etc."
                  />
                </div>

                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => router.push('/results')}
                    className="btn btn-outline"
                  >
                    <ArrowLeft size={16} />
                    Back to Results
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Continue to Seat Selection
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Step 2: Seat Selection */}
        {currentStep === 2 && (
          <div className="max-w-4xl mx-auto">
            <div className="glass-card p-8" style={{ background: 'rgba(5, 13, 28, 0.8)' }}>
              <h2 className="font-black text-2xl mb-6">Select Your Seat</h2>
              
              <Suspense fallback={
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              }>
                <SeatMap 
                  flightId={selectedFlight.id}
                  onSeatSelect={handleSeatSelection}
                  cabinClass={bookingData.cabinClass}
                />
              </Suspense>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {currentStep === 3 && (
          <div className="max-w-2xl mx-auto">
            <div className="glass-card p-8" style={{ background: 'rgba(5, 13, 28, 0.8)' }}>
              <h2 className="font-black text-2xl mb-6">Payment Information</h2>
              
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                <div>
                  <label className="input-label">Payment Method</label>
                  <select
                    value={paymentData.method}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, method: e.target.value }))}
                    className="input-field"
                  >
                    <option value="credit-card">Credit Card</option>
                    <option value="debit-card">Debit Card</option>
                    <option value="upi">UPI</option>
                    <option value="net-banking">Net Banking</option>
                  </select>
                </div>

                {(paymentData.method === 'credit-card' || paymentData.method === 'debit-card') && (
                  <div className="space-y-6">
                    <div>
                      <label className="input-label">Card Number *</label>
                      <input
                        type="text"
                        value={paymentData.cardNumber}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, cardNumber: e.target.value.replace(/\s/g, '') }))}
                        className="input-field"
                        placeholder="4111 1111 1111 1111"
                        maxLength={19}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="input-label">Cardholder Name *</label>
                      <input
                        type="text"
                        value={paymentData.cardName}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, cardName: e.target.value }))}
                        className="input-field"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="input-label">Expiry Date *</label>
                        <input
                          type="text"
                          value={paymentData.cardExpiry}
                          onChange={(e) => setPaymentData(prev => ({ ...prev, cardExpiry: e.target.value }))}
                          className="input-field"
                          placeholder="MM/YY"
                          maxLength={5}
                          required
                        />
                      </div>
                      <div>
                        <label className="input-label">CVV *</label>
                        <input
                          type="text"
                          value={paymentData.cardCvv}
                          onChange={(e) => setPaymentData(prev => ({ ...prev, cardCvv: e.target.value }))}
                          className="input-field"
                          placeholder="123"
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-3 text-sm">
                      <input
                        type="checkbox"
                        checked={paymentData.saveCard}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, saveCard: e.target.checked }))}
                      />
                      Save card for future bookings
                    </label>
                  </div>
                )}

                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Shield size={20} className="text-primary" />
                    <div className="text-sm">
                      <div className="font-bold">Secure Payment</div>
                      <div className="text-text-muted">Your payment information is encrypted and secure</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="btn btn-outline"
                  >
                    <ArrowLeft size={16} />
                    Back to Seat Selection
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin w-4 h-4 border-2 border-dark border-t-transparent rounded-full" />
                        Processing...
                      </div>
                    ) : (
                      `Complete Booking - ${formatFare(selectedFlight.price)}`
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {currentStep === 4 && bookingComplete && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="glass-card p-8" style={{ background: 'rgba(5, 13, 28, 0.8)' }}>
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={40} className="text-dark" />
              </div>
              
              <h1 className="font-black text-3xl mb-4">Booking Confirmed!</h1>
              
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-6">
                <div className="text-2xl font-black text-primary mb-2">PNR: {bookingPNR}</div>
                <div className="text-text-muted">Please save this for future reference</div>
              </div>

              <div className="space-y-4 mb-8 text-left">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-text-muted">Passenger:</span>
                  <span className="font-bold">{bookingData.passengerName}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-text-muted">Flight:</span>
                  <span className="font-bold">{selectedFlight.flight_number}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-text-muted">Route:</span>
                  <span className="font-bold">
                    {(selectedFlight.departure_airport?.code || selectedFlight.origin || searchInfo?.fromAirport?.code) +
                      ' → ' +
                      (selectedFlight.arrival_airport?.code || selectedFlight.destination || searchInfo?.toAirport?.code)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-text-muted">Date:</span>
                  <span className="font-bold">
                    {searchInfo?.departureDate || searchInfo?.date
                      ? new Date((searchInfo.departureDate || searchInfo.date) + 'T12:00:00').toLocaleDateString()
                      : '—'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-text-muted">Seat:</span>
                  <span className="font-bold">{bookingData.seatNumber}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-text-muted">Total Paid:</span>
                  <span className="font-bold text-primary text-xl">
                    {formatFare(selectedFlight.price)}
                  </span>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button 
                  onClick={() => window.print()}
                  className="btn btn-outline"
                >
                  Print E-Ticket
                </button>
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="btn btn-primary"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="view active">
        <Header />
        <div className="container flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}
