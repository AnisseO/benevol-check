import '../styles/TableauDeBord.css';
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getAttestations } from '../services/attestations'; 
import { getDemandesEnAttente, getAttestationsBenevole, validerAttestation, refuserAttestation } from '../services/attestations';

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
          <button onClick={() => navigate('/attestations-demandes')}>Voir toutes les demandes</button>
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

        <button onClick={() => navigate('/attestations')}>Voir mes attestations</button>

      } else if (user?.role === 'bénévole') {
      try {
        const data = await getAttestationsBenevole(user._id);
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
          <button onClick={() => navigate('/attestations')}>Voir toutes mes attestations</button>

          <h2>Mes attestations</h2>
          <ul>
  {attestations.map(att => (
    <li key={att._id}>
      <strong>{att.nomAssociation}</strong>
      {" — du "}
      {new Date(att.dateDebut).toLocaleDateString()}{" au "}
      {new Date(att.dateFin).toLocaleDateString()}
      {" — "}
      <span
        style={{
          color: att.validee ? "green" : "orange",
          fontWeight: "bold",
          marginLeft: 8
        }}
      >
        {att.validee ? "Validée" : "En attente"}
      </span>
      {att.validee && (
        <button
          style={{ marginLeft: 12 }}
          onClick={() =>
            window.open(
              `http://localhost:5000/api/attestation/${att._id}/pdf`,
              "_blank"
            )
          }
        >
          Télécharger PDF
        </button>
      )}
    </li>
  ))}
</ul>

          <button
      onClick={() => navigate('/remplir-attestation')}
      className="demande-btn"
      style={{ marginBottom: "16px" }}
    >
      Demander une nouvelle attestation
    </button>
          
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
              
            </div>
              ))
          )}

          <button
      style={{ marginBottom: "16px" }}
      onClick={() => navigate('/attestations-demandes')}
      className="demande-btn"
    >
      Voir toutes les demandes en attente
    </button>
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