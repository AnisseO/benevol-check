import '../styles/TableauDeBord.css';
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getAttestations } from '../services/attestations'; 

const TableauDeBord = () => {
  
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      logout();
      navigate('/');
    }
  };

const [attestations, setAttestations] = useState([]);

useEffect(() => {
  const fetchAttestations = async () => {
    const data = await getAttestations();
    setAttestations(data);
  };
  fetchAttestations();
}, []);

  return (
    <div className="tableau-de-bord">
      <h1>Bonjour, {user?.email || 'utilisateur'} !</h1>
      
      {/* Bouton de déconnexion */}
      <button 
        onClick={handleLogout}
        className="logout-btn"
      >
        Se déconnecter
      </button>

      {/* ... Autres éléments de ton tableau de bord ... */}
    </div>
  );
};

export default TableauDeBord;