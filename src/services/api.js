import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Remplace par URL backend
});

export const login = (email, password) => api.post('/login', { email, password });
export const fetchAttestations = () => api.get('/attestations');

export default api;