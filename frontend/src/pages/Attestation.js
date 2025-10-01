import React, { useEffect, useState, useContext } from 'react';
import { getAttestationsBenevole } from '../services/attestations';
import { AuthContext } from '../context/AuthContext';
import SearchBar from '../components/SearchBar';
import { AXES, AXE_LABELS } from "../components/Axes";


const Attestations = () => {
  const { user } = useContext(AuthContext);
  const [attestations, setAttestations] = useState([]);
  const [opened, setOpened] = useState(null); // stocke l'ID de l’attestation ouverte
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(attestations);

  useEffect(() => {
    const fetch = async () => {
      if (user && user._id) {
        const data = await getAttestationsBenevole(user._id);
        setAttestations(data || []);
        setFiltered(data || []);
      }
    };
    fetch();
  }, [user]);

  // Filtrage dynamique quand searchBar change
  useEffect(() => {
    setFiltered(
      attestations.filter((att) =>
        att.nomAssociation?.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, attestations]);

  return (
    <div>
      <h2>Mes attestations</h2>

      <SearchBar
        placeholder="Rechercher par association..."
        value={search}
        onChange={setSearch}
      />

      <ul style={{ listStyle: "none", padding: 0 }}>
        {filtered.map((att) => (
          <li
            key={att._id}
            style={{
              marginBottom: "1em",
              border: "1px solid #eee",
              borderRadius: 8,
              padding: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span>
                <strong>{att.nomAssociation}</strong>
                {" — du "}
                {new Date(att.dateDebut).toLocaleDateString()}{" au "}
                {new Date(att.dateFin).toLocaleDateString()}
                {" — "}
                <span
                  style={{
                    color: att.validee ? "green" : "orange",
                    fontWeight: "bold",
                    marginLeft: 8,
                  }}
                >
                  {att.validee ? "Validée" : "En attente"}
                </span>
              </span>

              <div>
                <button
                  onClick={() =>
                    setOpened(opened === att._id ? null : att._id)
                  }
                >
                  {opened === att._id ? "Fermer" : "Détails"}
                </button>

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
              </div>
            </div>

            {/* Détails déroulants */}
            {opened === att._id && (
              <div
                style={{
                  marginTop: 10,
                  background: "#fafafa",
                  padding: 12,
                  borderRadius: 6,
                }}
              >
                <div>
                  <b>Description :</b> {att.description}
                </div>

                {/* Auto-évaluation */}
                <div style={{ marginTop: 8 }}>
                  <b>Auto-évaluation :</b>
                  <ul>
                    {["I", "II", "III"].map((axe) => (
                      <li key={axe}>
                        <b>{AXE_LABELS[axe]}</b>
                        <ul>
                          {att.evaluationComportements &&
                            att.evaluationComportements[axe] &&
                            att.evaluationComportements[axe].map(
                              (checked, idx) => (
                                <li key={idx}>
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    readOnly
                                  />{" "}
                                  {AXES[axe][idx]}
                                </li>
                              )
                            )}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Attestations;
