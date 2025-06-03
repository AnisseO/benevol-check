import '../styles/Connexion.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';
import { Link } from 'react-router-dom'; 
import api from '../services/api'; 
import axios from 'axios';

const Connexion = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        {email, password}
      )
      const data = response.data;
      localStorage.setItem('token', data.token); // Stocke le token 
      navigate('/tableau-de-bord'); // Redirige vers le tableau de bord
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
      setError(err.message || 'Identifiants incorrects');
    }
    }
  };

  return (
    <div className="connexion-container">
      <h1>Connexion</h1>
      
      {/* Affiche l'erreur si elle existe */}
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Adresse mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Se connecter</button>
      </form>

      <div className="auth-switch">
      <p>Pas encore de compte ?</p>
      <Link to="/inscription" className="auth-link">
        Créer un compte
      </Link>
    </div>
    </div>
  );
};

export default Connexion;