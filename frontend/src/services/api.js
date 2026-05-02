import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
});

export const getListings = (params = {}) => api.get('/listings', { params });

export const getAIRecommendations = (data) => api.post('/ai/recommend', data);

export default api;
