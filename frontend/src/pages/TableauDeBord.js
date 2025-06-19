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
    {/* Bouton PDF seulement si validée */}
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