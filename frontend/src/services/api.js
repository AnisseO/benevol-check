import axios from 'axios';

const api = axios.create({
baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

export const login = (email, password) => api.post('/login', { email, password });
export const fetchAttestations = () => api.get('/attestations');

export default api;