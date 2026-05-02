import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
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

// ─── Admin ────────────────────────────────────────────────────────────────────
export const adminGetAnalytics = () => api.get('/admin/analytics');

// Users
export const adminGetUsers = (params = {}) => api.get('/admin/users', { params });
export const adminUpdateUserRole = (id, role) => api.put(`/admin/users/${id}/role`, { role });
export const adminDeleteUser = (id) => api.delete(`/admin/users/${id}`);

// Listings
export const adminGetListings = (params = {}) => api.get('/admin/listings', { params });
export const adminVerifyListing = (id, isVerified) => api.put(`/admin/listings/${id}/verify`, { isVerified });
export const adminDeleteListing = (id) => api.delete(`/admin/listings/${id}`);

// Bookings
export const adminGetBookings = (params = {}) => api.get('/admin/bookings', { params });
export const adminUpdateBooking = (id, data) => api.put(`/admin/bookings/${id}`, data);
export const adminDeleteBooking = (id) => api.delete(`/admin/bookings/${id}`);

// Reviews
export const adminGetReviews = (params = {}) => api.get('/admin/reviews', { params });
export const adminDeleteReview = (id) => api.delete(`/admin/reviews/${id}`);

export default api;
