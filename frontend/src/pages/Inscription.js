import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/auth';
import '../styles/Inscription.css'; 

const Inscription = () => {
  
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    password: '',
    role: 'bénévole' 
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess("Inscription réussie ! Vous pouvez vous connecter.");
        setTimeout(() => navigate("/"), 1500); // Redirige vers login après succès
      } else {
        setError(data.message || "Erreur lors de l'inscription.");
      }
    } catch (err) {
      setError("Erreur réseau");
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

      <p className="login-link">
        Déjà un compte ? <a href="/">Se connecter</a>
      </p>
    </div>
  );
};

export default Inscription;