import '../styles/TableauDeBord.css';
import logo from '../assets/logo_france_benevolat.png';
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getAttestations } from '../services/attestations'; 
import { getDemandesEnAttente, getAttestationsBenevole, validerAttestation, refuserAttestation } from '../services/attestations';
import AideButton from '../components/AideButton';
import ThemeToggle from '../components/ThemeToggle';

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
<button
            className="new-attestation-btn"
            onClick={() => navigate('/attestations-validees')}
          >
            Voir toutes mes attestations validées
          </button>
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
      <div className="header">
        <img src={logo} alt="Logo France Bénévolat" className="header-logo" />
        <div className="header-title">Bonjour, {user?.nom || user?.email || "utilisateur"} !</div>
        <ThemeToggle />
        <button className="logout-btn" onClick={handleLogout}>Déconnexion</button>
      </div>

      {/* Affichage différent selon le rôle */}
      {user?.role === "bénévole" ? (
        <div>
          <button className="new-attestation-btn" onClick={() => navigate('/attestations')}>Voir toutes mes attestations</button>
          <h2>Mes attestations</h2>
          <ul className="attestation-list">
            {attestations
              .slice() // copie
              .sort((a, b) => new Date(b.dateDebut) - new Date(a.dateDebut)) // tri du plus récent au plus ancien
              .slice(0, 5) // limite à 5
              .map(att => (
                <li key={att._id} className="attestation-card">
                  <div className="attestation-header">
                    <span className="attestation-title">{att.nomAssociation}</span>
                    <span className={`attestation-status ${att.validee ? "validée" : "en-attente"}`}>
                      {att.validee ? "Validée" : "En attente"}
                    </span>
                  </div>
                  <div className="attestation-period">
                    du {new Date(att.dateDebut).toLocaleDateString()} au {new Date(att.dateFin).toLocaleDateString()}
                  </div>
                  {att.validee && (
                    <button
                      className="pdf-btn"
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
              className="new-attestation-btn"
            >
              + Demander une nouvelle attestation
            </button>
          </div>
        ) : user?.role === "responsable" ? (
          <div>
            <h2>Demandes à valider pour l'association {user.nomAssociation}</h2>
            {attestations.length === 0 ? (
              <p>Aucune demande à valider.</p>
            ) : (
              <ul className="attestation-list">
                {attestations
                  .slice() // copie
                  .sort((a, b) => new Date(b.dateDebut) - new Date(a.dateDebut)) // tri du plus récent au plus ancien
                  .slice(0, 5) // limite à 5
                  .map(att => (
                  <li key={att._id} className="attestation-card">
                    <div className="attestation-header">
                      <span className="attestation-title">{att.nomBenevole} ({att.emailBenevole})</span>
                      <span className="attestation-status en-attente">En attente</span>
                    </div>
                    <div className="attestation-period">
                      {att.nomAssociation} — {att.description}
                      <br />
                      du {new Date(att.dateDebut).toLocaleDateString()} au {new Date(att.dateFin).toLocaleDateString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <button
              className="new-attestation-btn"
              onClick={() => navigate('/attestations-demandes')}
            >
              Voir toutes les demandes en attente
            </button>
            <button
              className="new-attestation-btn"
              style={{ marginTop: 8 }}
              onClick={() => navigate('/attestations-validees')}
            >
              Voir toutes les attestations validées
            </button>
          </div>
        ) : null}
      <AideButton />
    </div>
  );
};

export default TableauDeBord;