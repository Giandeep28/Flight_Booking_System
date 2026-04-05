import axios from 'axios';

/** Flight search may return 404/503 with JSON body; do not throw. */
export async function postFlightSearch(params) {
  const body = {
    origin: params.from,
    destination: params.to,
    departure_date: params.date,
    return_date: params.returnDate || undefined,
    passengers: parseInt(String(params.passengers || '1'), 10) || 1,
    cabin_class: params.cabinClass || 'Economy',
    currency: params.currency || 'INR',
  };
  const { data } = await axios.post('/api/flights/search', body, {
    baseURL: '',
    timeout: 120000,
    validateStatus: (s) => s < 600,
    headers: { 'Content-Type': 'application/json' },
  });
  return data;
}

const api = axios.create({
  baseURL: '',
  timeout: 120000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('skyvoyage_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const msg = error.response?.data?.error || error.response?.data?.detail || error.message;
    return Promise.reject(new Error(typeof msg === 'string' ? msg : JSON.stringify(msg)));
  }
);

export const airportAPI = {
  /** @param {string} query @param {{ region?: 'IN' | 'INTL' }} [opts] */
  search: (query, opts = {}) => {
    const params = new URLSearchParams();
    if (query != null && String(query).length > 0) {
      params.set('q', String(query));
    }
    if (opts.region) {
      params.set('region', opts.region);
    }
    const qs = params.toString();
    return api.get(qs ? `/api/airports/search?${qs}` : '/api/airports/search');
  },
};

export const flightAPI = {
  search: (params) => postFlightSearch(params),
};

export const bookingAPI = {
  create: (bookingData) => api.post('/api/bookings', bookingData),
  getByPNR: (pnr) => api.get(`/api/bookings/${pnr}`),
  getUserBookings: () => api.get('/api/bookings/user'),
  cancel: (pnr) => api.delete(`/api/bookings/${pnr}`),
  generateETicket: (pnr) => api.get(`/api/bookings/${pnr}/eticket`, { responseType: 'blob' }),
};

export const paymentAPI = {
  initiate: (paymentData) => api.post('/api/payments/initiate', paymentData),
  verify: (paymentId) => api.get(`/api/payments/${paymentId}/verify`),
};

export const userAPI = {
  getProfile: () => api.get('/api/users/profile'),
  getBookingHistory: () => api.get('/api/users/bookings'),
  getLoyaltyPoints: () => api.get('/api/users/loyalty'),
};

export const chatbotAPI = {
  sendMessage: (message) => api.post('/api/chat', { text: message }),
};

export const flightStatusAPI = {
  byCallsign: (callsign) =>
    axios
      .get(`/api/flight-status?callsign=${encodeURIComponent(callsign)}`, { validateStatus: () => true })
      .then((r) => r.data),
  byIcao24: (icao24) =>
    axios
      .get(`/api/flight-status?icao24=${encodeURIComponent(icao24)}`, { validateStatus: () => true })
      .then((r) => r.data),
};

export const handleAPIError = (error) => ({ success: false, error: error.message });

export const createDebouncedAPI = (fn, delay = 300) => {
  let t;
  return (...args) =>
    new Promise((resolve, reject) => {
      clearTimeout(t);
      t = setTimeout(async () => {
        try {
          resolve(await fn(...args));
        } catch (e) {
          reject(e);
        }
      }, delay);
    });
};

export default api;
