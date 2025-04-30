import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

export const login = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    return response.data; // { token, userData }
  } catch (error) {
    // Si le backend renvoie une erreur structurée (ex: { message: "Mot de passe incorrect" })
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Erreur de connexion");
    } else {
      throw new Error("Problème de connexion au serveur");
    }
  }
};


export const register = async (userData) => {
  try {
    const response = await api.post('/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Échec de l'inscription");
    }
};