import axios from 'axios';

const api = axios.create({
baseURL: "https://benevol-check.onrender.com" ,
});

export const testBackend = async () => {
  try {
    const response = await api.get('/test');
    console.log('Connexion backend OK :', response.data);
    return true;
  } catch (error) {
    console.error('Échec de connexion au backend :', error);
    return false;
  }
};

export const login = (email, password) => api.post('/login', { email, password });
export const fetchAttestations = () => api.get('/attestations');

export default api;