import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'; // Express Gateway

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor for JWT
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('skyvoyage_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// API Methods
export const flightApi = {
  search: (params) => apiClient.get('/flights', { params }),
  getDetails: (id) => apiClient.get(`/flights/${id}`),
};

export const bookingApi = {
  create: (data) => apiClient.post('/bookings', data),
  getUserBookings: () => apiClient.get('/bookings/my'),
  getPNRStatus: (pnr) => apiClient.get(`/bookings/status/${pnr}`),
};

export const chatbotApi = {
  sendMessage: (message) => apiClient.post('/chat', { message }),
};

export default apiClient;
