'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plane, 
  Calendar, 
  User, 
  CreditCard, 
  Download, 
  Search, 
  Settings, 
  LogOut,
  MapPin,
  Clock,
  Shield,
  Star,
  TrendingUp,
  Award
} from 'lucide-react';
import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import { bookingAPI, userAPI, flightStatusAPI } from '@/lib/api';
import { formatMoney } from '@/lib/formatMoney';
import toast from 'react-hot-toast';

function DashboardContent() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [userStats, setUserStats] = useState({
    totalBookings: 0,
    totalFlights: 0,
    totalSpent: 0,
    favoriteDestination: ''
  });
  const [statusByPnr, setStatusByPnr] = useState({});

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    loadUserData();
  }, [user, router]);

  const loadUserData = async () => {
    try {
      setLoading(true);

      const bookingsData = await bookingAPI.getUserBookings();
      const list = bookingsData.bookings || [];
      setBookings(list);

      let loyalty = { points: 0 };
      try {
        loyalty = await userAPI.getLoyaltyPoints();
      } catch {
        /* optional */
      }
      setLoyaltyPoints(loyalty.points || 0);

      let stats = {};
      try {
        stats = await userAPI.getBookingHistory();
      } catch {
        stats = {};
      }
      setUserStats({
        totalBookings: stats.totalBookings ?? list.length,
        totalFlights: stats.totalFlights ?? list.length,
        totalSpent: stats.totalSpent ?? 0,
        favoriteDestination: stats.favoriteDestination || '—'
      });

      const nextStatus = {};
      for (const b of list.slice(0, 5)) {
        const fn = b.flightOffer?.flight_number || b.flightOffer?.flightNumber;
        if (!fn) continue;
        const cs = String(fn).replace(/\s+/g, '').toUpperCase();
        try {
          const data = await flightStatusAPI.byCallsign(cs);
          nextStatus[b.pnr] = data;
        } catch {
          nextStatus[b.pnr] = { error: 'Live position unavailable (OpenSky coverage varies).' };
        }
      }
      setStatusByPnr(nextStatus);
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleDownloadTicket = async (booking) => {
    try {
      const eticket = await bookingAPI.generateETicket(booking.pnr);
      
      // Create download link
      const blob = new Blob([eticket], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `e-ticket-${booking.pnr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('E-ticket downloaded successfully');
    } catch (error) {
      console.error('Error downloading ticket:', error);
      toast.error('Failed to download e-ticket');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const d = new Date(dateString);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
    return String(dateString);
  };

  const formatTime = (dateString) => {
    if (!dateString) return '—';
    if (typeof dateString === 'string' && dateString.length <= 8 && dateString.includes(':')) {
      return dateString;
    }
    const d = new Date(dateString);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    return String(dateString);
  };

  const getBookingStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'text-green-400';
      case 'completed': return 'text-blue-400';
      case 'cancelled': return 'text-red-400';
      case 'pending': return 'text-yellow-400';
      default: return 'text-text-muted';
    }
  };

  const upcomingBookings = bookings;
  const pastBookings = [];

  if (loading) {
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
        {/* Welcome Section */}
        <div className="glass-card p-8 mb-8" style={{ background: 'rgba(5, 13, 28, 0.8)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-black text-3xl mb-2">
                Welcome back, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-text-muted">
                Manage your bookings and track your travel journey
              </p>
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-2 text-primary mb-2">
                <Star size={20} />
                <span className="font-bold text-xl">{loyaltyPoints.toLocaleString()}</span>
              </div>
              <div className="text-sm text-text-muted">Loyalty Points</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass-card p-6 text-center" style={{ background: 'rgba(5, 13, 28, 0.8)' }}>
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plane size={24} className="text-primary" />
            </div>
            <div className="text-2xl font-black mb-2">{userStats.totalFlights}</div>
            <div className="text-text-muted text-sm">Total Flights</div>
          </div>
          
          <div className="glass-card p-6 text-center" style={{ background: 'rgba(5, 13, 28, 0.8)' }}>
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={24} className="text-primary" />
            </div>
            <div className="text-2xl font-black mb-2">{userStats.totalBookings}</div>
            <div className="text-text-muted text-sm">Total Bookings</div>
          </div>
          
          <div className="glass-card p-6 text-center" style={{ background: 'rgba(5, 13, 28, 0.8)' }}>
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard size={24} className="text-primary" />
            </div>
            <div className="text-2xl font-black mb-2">
              {formatMoney(userStats.totalSpent || 0, 'INR')}
            </div>
            <div className="text-text-muted text-sm">Total Spent</div>
          </div>
          
          <div className="glass-card p-6 text-center" style={{ background: 'rgba(5, 13, 28, 0.8)' }}>
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin size={24} className="text-primary" />
            </div>
            <div className="text-lg font-black mb-2">{userStats.favoriteDestination}</div>
            <div className="text-text-muted text-sm">Favorite Destination</div>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="glass-card p-8" style={{ background: 'rgba(5, 13, 28, 0.8)' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-black text-2xl">My Bookings</h2>
            
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                  activeTab === 'upcoming' 
                    ? 'bg-primary text-dark' 
                    : 'bg-gray-700 text-text-muted hover:bg-gray-600'
                }`}
              >
                Upcoming ({upcomingBookings.length})
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                  activeTab === 'past' 
                    ? 'bg-primary text-dark' 
                    : 'bg-gray-700 text-text-muted hover:bg-gray-600'
                }`}
              >
                Past ({pastBookings.length})
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {(activeTab === 'upcoming' ? upcomingBookings : pastBookings).length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plane size={32} className="text-gray-500" />
                </div>
                <h3 className="font-black text-xl mb-2">No {activeTab} bookings</h3>
                <p className="text-text-muted">
                  {activeTab === 'upcoming' 
                    ? 'You have no upcoming flights. Book your next adventure!' 
                    : 'Your past bookings will appear here'}
                </p>
                {activeTab === 'upcoming' && (
                  <button 
                    onClick={() => router.push('/')}
                    className="btn btn-primary mt-4"
                  >
                    Book a Flight
                  </button>
                )}
              </div>
            ) : (
              (activeTab === 'upcoming' ? upcomingBookings : pastBookings).map((booking) => {
                const fo = booking.flightOffer || {};
                const st = statusByPnr[booking.pnr];
                return (
                <div key={booking.pnr} className="border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="font-bold text-lg">{fo.flight_number || '—'}</div>
                        <div className="text-sm text-text-muted">{fo.airline_name || fo.airline_code}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-sm font-bold ${getBookingStatusColor(booking.status)}`}>
                        {booking.status.toUpperCase()}
                      </div>
                      <div className="text-xs text-text-muted">PNR: {booking.pnr}</div>
                    </div>
                  </div>

                  {st?.error && (
                    <p className="text-xs text-amber-400/90 mb-2">{st.error}</p>
                  )}
                  {st && !st.error && st.states && (
                    <p className="text-xs text-green-400/90 mb-2">OpenSky: live airspace data available for this callsign.</p>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-text-muted mb-1">From</div>
                      <div className="font-bold">{fo.origin || fo.departure_airport?.code || '—'}</div>
                      <div className="text-sm">{formatTime(fo.departure_time)}</div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-text-muted mb-1">To</div>
                      <div className="font-bold">{fo.destination || fo.arrival_airport?.code || '—'}</div>
                      <div className="text-sm">{formatTime(fo.arrival_time)}</div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xs text-text-muted mb-1">Amount</div>
                      <div className="font-bold text-primary text-lg">
                        {formatMoney(fo.price || 0, fo.currency || 'INR')}
                      </div>
                      <div className="text-sm text-text-muted">{fo.cabin_class || 'Economy'}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-text-muted">
                      <User size={14} />
                      <span>{booking.passengers?.[0]?.name || '—'}</span>
                      <span>•</span>
                      <span>Seat {booking.seatMap?.seat || '—'}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      {activeTab === 'upcoming' && booking.status === 'confirmed' && (
                        <button
                          onClick={() => handleDownloadTicket(booking)}
                          className="btn btn-outline text-sm px-3 py-1"
                        >
                          <Download size={14} />
                          E-Ticket
                        </button>
                      )}
                      
                      <button
                        onClick={() => router.push(`/manage?pnr=${booking.pnr}`)}
                        className="btn btn-outline text-sm px-3 py-1"
                      >
                        <Search size={14} />
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
              );
              })
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <button 
            onClick={() => router.push('/')}
            className="glass-card p-6 text-left hover:border-primary/50 transition-colors group"
            style={{ background: 'rgba(5, 13, 28, 0.8)' }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary transition-colors">
                <Plane size={20} className="text-primary group-hover:text-dark" />
              </div>
              <div>
                <div className="font-bold">Book New Flight</div>
                <div className="text-sm text-text-muted">Plan your next journey</div>
              </div>
            </div>
          </button>
          
          <button 
            onClick={() => router.push('/manage')}
            className="glass-card p-6 text-left hover:border-primary/50 transition-colors group"
            style={{ background: 'rgba(5, 13, 28, 0.8)' }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary transition-colors">
                <Search size={20} className="text-primary group-hover:text-dark" />
              </div>
              <div>
                <div className="font-bold">Manage Booking</div>
                <div className="text-sm text-text-muted">Check PNR status</div>
              </div>
            </div>
          </button>
          
          <button 
            onClick={handleLogout}
            className="glass-card p-6 text-left hover:border-primary/50 transition-colors group"
            style={{ background: 'rgba(5, 13, 28, 0.8)' }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary transition-colors">
                <LogOut size={20} className="text-primary group-hover:text-dark" />
              </div>
              <div>
                <div className="font-bold">Sign Out</div>
                <div className="text-sm text-text-muted">Secure logout</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="view active">
      <DashboardContent />
    </div>
  );
}
