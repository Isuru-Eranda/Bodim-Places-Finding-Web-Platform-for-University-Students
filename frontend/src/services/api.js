import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
});

// Attach token from localStorage to every request
api.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem('bodim_user');
    if (stored) {
      const { token } = JSON.parse(stored);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // ignore
  }
  return config;
});

// Auth
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');

// Listings
export const getListings = (params = {}, signal) => api.get('/listings', { params, signal });
export const getListingById = (id) => api.get(`/listings/${id}`);

export const getAIRecommendations = (data) => api.post('/ai/recommend', data);

// Bookings
export const createBooking = (data) => api.post('/bookings', data);
export const getMyBookings = () => api.get('/bookings/my');

// Reviews
export const getReviews = (listingId) => api.get(`/reviews/${listingId}`);
export const addReview = (data) => api.post('/reviews', data);

export default api;
