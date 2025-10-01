import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import SearchBar from "../components/SearchhBar";

const AttestationsValidees = () => {
  const { user } = useContext(AuthContext);
  const [attestations, setAttestations] = useState([]);
  const [opened, setOpened] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      if (user && user._id) {
        const res = await axios.get(`http://localhost:5000/api/attestation/validees/${user._id}`);
        setAttestations(res.data);
      }
    };
    fetch();
  }, [user]);

  const filteredAttestations = attestations.filter((att) =>
    att.nomBenevole?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 16 }}>
      <h2>Attestations validées</h2>

      {/* Barre de recherche */}
      <input
        type="text"
        placeholder="Rechercher par nom du bénévole..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          marginBottom: 16,
          padding: 8,
          width: "100%",
          maxWidth: 400,
          borderRadius: 6,
          border: "1px solid #ccc",
        }}
      />

      {filteredAttestations.length === 0 ? (
        <p>Aucune attestation trouvée.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {filteredAttestations.map((att) => (
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
                  <strong>{att.nomBenevole}</strong> ({att.emailBenevole}) —{" "}
                  {att.nomAssociation}
                  {" — du "}
                  {new Date(att.dateDebut).toLocaleDateString()}{" au "}
                  {new Date(att.dateFin).toLocaleDateString()}
                </span>
                <button
                  onClick={() =>
                    setOpened(opened === att._id ? null : att._id)
                  }
                >
                  {opened === att._id ? "Fermer" : "Détails"}
                </button>
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
                  <div>
                    <b>Validée le :</b>{" "}
                    {att.dateValidation
                      ? new Date(att.dateValidation).toLocaleDateString()
                      : "—"}
                  </div>

                  {/* Commentaire du responsable */}
                  {att.commentaire && (
                    <div style={{ marginTop: 8 }}>
                      <b>Commentaire du responsable :</b>
                      <p>{att.commentaire}</p>
                    </div>
                  )}

                  {/* Évaluations */}
                  <div style={{ marginTop: 8 }}>
                    <b>Évaluation :</b>
                    <ul>
                      {["I", "II", "III"].map((axe) => (
                        <li key={axe}>
                          <b>{AXE_LABELS[axe]}</b>
                          <ul>
                            {att.evaluationComportements &&
                              att.evaluationComportements[axe] &&
                              att.evaluationComportements[axe].map(
                                (checked, idx) =>
                                  checked && ( // On affiche seulement les cases cochées
                                    <li key={idx}>{AXES[axe][idx]}</li>
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
      )}
    </div>
  );
};

      
const AXES = {
  I: [
    "Il/Elle a bien compris en quoi consistait sa mission pour en maîtriser la pratique",
    "Il/Elle a exercé son activité sans avoir besoin d'une supervision",
    "Il/Elle a réagi avec pertinence pour modifier sa façon de faire face aux problèmes rencontrés",
    "Il/Elle a proposé des idées pour rendre son activité plus efficace ou plus conviviale."
  ],
  II: [
    "Il/Elle a facilleement trouvé sa place parmi les autres membres du groupe",
    "Dans son action, il/elle a tenu compte de l'activité des autres membres de son équipe",
    "Dans les moments de tension, il/elle a su se mettre à la place de l'autre pour comprendre son point de vue et éviter les conflits",
    "Il/Elle a montré des capacités pour motiver l'activité des autres et les solliciter en leur apportant si nécessaire un conseil ou un appui."
  ],
  III: [
    "Il/Elle a exercé son activité dans le respect des règles, de pratiques et des valeurs de l'association",
    "Il/Elle s'est senti personnellement concerné par la bonne réalisation des tâches ou la conduite des projets jusqu'à leur accomplissement",
    "Il/Elle s'est intéressé à la vie de l'association, à son projet associatif et à ses diverses activités.",
    "Il/Elle s'est montré prêt à prendre des responsabilités dans l'animation, la vie collective ou le développement de l'association."
  ]
};

const AXE_LABELS = {
  I: "Comportement dans l'action",
  II: "Comportement avec les autres bénévoles",
  III: "Comportement vis-à-vis de l'association"
};

export default AttestationsValidees;
