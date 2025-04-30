import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/auth';
import '../../styles/Inscription.css'; // Utilisez le même style que Connexion.css

const Inscription = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    password: '',
    role: 'bénévole' // 'responsable' si besoin
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/connexion'); // Redirige vers la connexion après inscription
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="inscription-container">
      <h1>Inscription</h1>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom complet"
          value={formData.nom}
          onChange={(e) => setFormData({...formData, nom: e.target.value})}
          required
        />
        <input
          type="email"
          placeholder="Adresse email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />
        
        <select 
          value={formData.role}
          onChange={(e) => setFormData({...formData, role: e.target.value})}
        >
          <option value="bénévole">Bénévole</option>
          <option value="responsable">Responsable</option>
        </select>

        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
};

export default Inscription;