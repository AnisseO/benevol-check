import '../styles/TableauDeBord.css';
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getAttestations } from '../services/attestations'; 

const TableauDeBord = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [attestations, setAttestations] = useState([]);

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      logout();
      navigate('/');
    }
  };

  useEffect(() => {
    const fetchAttestations = async () => {
      try {
        const data = await getAttestations();
        setAttestations(data || []);
      } catch (err) {
        setAttestations([]);
        console.error("Erreur de récupération des attestations :", err.message);
      }
    };
    fetchAttestations();
  }, []);

  return (
    <div className="tableau-de-bord">
      <h1>Bonjour, {user?.nom || 'utilisateur'} !</h1>

      {/* Affichage différent selon le rôle */}
      {user?.role === 'bénévole' ? (
        <div>
          <h2>Mes attestations</h2>
          {attestations.length === 0 ? (
            <p>Aucune attestation pour l’instant.</p>
          ) : (
            attestations.map(att => (
              <div key={att._id}>
                <strong>{att.nomAssociation}</strong> — Statut : {att.validee ? "Validée" : "En attente"}
                {/* Ajouter ici bouton PDF plus tard */}
              </div>
            ))
          )}
          {/* Bouton demander une nouvelle attestation ici plus tard */}
        </div>
      ) : user?.role === 'responsable' ? (
        <div>
          <h2>Demandes à valider</h2>
          {attestations.filter(att => !att.validee).length === 0 ? (
            <p>Aucune demande en attente.</p>
          ) : (
            attestations
              .filter(att => !att.validee)
              .map(att => (
                <div key={att._id}>
                  <strong>{att.nomBenevole}</strong> — {att.nomAssociation}
                  <button>Valider</button>
                  <button>Rejeter</button>
                </div>
              ))
          )}
        </div>
      ) : null}

      <button 
        onClick={handleLogout}
        className="logout-btn"
      >
        Se déconnecter
      </button>
    </div>
  );
};

export default TableauDeBord;