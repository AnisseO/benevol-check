import '../styles/TableauDeBord.css';
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getAttestations } from '../services/attestations'; 
import { getDemandesEnAttente, validerAttestation, refuserAttestation } from '../services/attestations';

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
      if (user?.role === 'responsable') {

        try {
          const data = await getDemandesEnAttente();
          setAttestations(data);
        } catch (err) {
          setAttestations([]);
          console.error(
            "Erreur lors de la récupération des demandes :",
            err
          );
        }
      } else {
        try {
          const data = await getAttestations();
          setAttestations(data || []);
        } catch (err) {
          setAttestations([]);
          console.error(
            "Erreur de récupération des attestations :",
            err.message
          );
        }
      }
    };
    fetchAttestations();
  }, [user]);

  return (
    <div className="tableau-de-bord">
      <h1>Bonjour, {user?.nom || 'utilisateur'} !</h1>

      {/* Affichage différent selon le rôle */}
      {user?.role === 'bénévole' ? (
        <div>
          <h2>Mes attestations</h2>
          <button
      onClick={() => navigate('/remplir-attestation')}
      className="demande-btn"
      style={{ marginBottom: "16px" }}
    >
      Demander une nouvelle attestation
    </button>
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
          <h2>Demandes à valider pour l'association {user.nomAssociation}</h2>
          {attestations.length === 0 ? (
            <p>Aucune demande à valider.</p>
        ) : (
          attestations.map(att => (
            <div key={att._id} className="attestation-item">
              <strong>{att.nomBenevole} ({att.emailBenevole})</strong>
              <span> — {att.nomAssociation} — {att.description}</span>
              <span> — du {new Date(att.dateDebut).toLocaleDateString()} au {new Date(att.dateFin).toLocaleDateString()}</span>
              <div>
    <h2>Demandes à valider</h2>
    {attestations.length === 0 ? (
      <p>Aucune demande à valider.</p>
    ) : (
      attestations.map(att => (
        <div key={att._id}>
          <strong>{att.nomBenevole}</strong> — {att.nomAssociation}
          <button onClick={async () => {
            await validerAttestation(att._id);
            // Refresh la liste après validation
            const data = await getDemandesEnAttente();
            setAttestations(data);
          }}>
            Valider
          </button>
          <button onClick={async () => {
            await refuserAttestation(att._id);
            // Refresh la liste après suppression
            const data = await getDemandesEnAttente();
            setAttestations(data);
          }}>
            Refuser
          </button>
        </div>
      ))
    )}
  </div>
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