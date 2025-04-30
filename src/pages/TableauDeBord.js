import '../styles/TableauDeBord.css';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const TableauDeBord = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      logout();
      navigate('/');
    }
  };

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