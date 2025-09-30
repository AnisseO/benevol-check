import React, { useEffect, useState, useContext } from 'react';
import { getAttestationsBenevole } from '../services/attestations';
import { AuthContext } from '../context/AuthContext';

const Attestations = () => {
  const { user } = useContext(AuthContext);
  const [attestations, setAttestations] = useState([]);
  const [opened, setOpened] = useState(null); // stocke l'ID de l’attestation ouverte

  useEffect(() => {
    const fetch = async () => {
      if (user && user._id) {
        const data = await getAttestationsBenevole(user._id);
        setAttestations(data || []);
      }
    };
    fetch();
  }, [user]);

  return (
    <div>
      <h2>Mes attestations</h2>
      <ul style={{listStyle: "none", padding: 0}}>
        {attestations.map(att => (
          <li key={att._id} style={{marginBottom: "1em", border: "1px solid #eee", borderRadius: 8, padding: 12}}>
            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
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
                    marginLeft: 8
                  }}
                >
                  {att.validee ? "Validée" : "En attente"}
                </span>
              </span>
              <button onClick={() => setOpened(opened === att._id ? null : att._id)}>
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
            {/* Détails déroulants */}
            {opened === att._id && (
              <div style={{marginTop: 10, background: "#fafafa", padding: 12, borderRadius: 6}}>
                <div><b>Description :</b> {att.description}</div>
                {/* Affichage auto-évaluation */}
                <div style={{marginTop: 8}}>
                  <b>Auto-évaluation :</b>
                  <ul>
                    {["I", "II", "III"].map(axe => (
                      <li key={axe}>
                        <b>{AXE_LABELS[axe]}</b>
                        <ul>
                          {att.evaluationComportements && att.evaluationComportements[axe] && att.evaluationComportements[axe].map((checked, idx) => (
                            <li key={idx}>
                              <input type="checkbox" checked={checked} readOnly />
                              {" "}
                              {AXES[axe][idx]}
                            </li>
                          ))}
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

const AXE_LABELS = {
  I: "Comportement dans l'action",
  II: "Comportement avec les autres bénévoles",
  III: "Comportement vis-à-vis de l'association"
};

const AXES = {
  I: [
    "Il/Elle a bien compris en quoi consistait sa mission pour en maîtriser la pratique",
    "Il/Elle a exercé son activité sans avoir besoin d'une supervision",
    "Il/Elle a réagi avec pertinence pour modifier sa façon de faire face aux problèmes rencontrés",
    "Il/Elle a proposé des idées pour rendre son activité plus efficace ou plus conviviale."
  ],
  II: [
    "Il/Elle a facilement trouvé sa place parmi les autres membres du groupe",
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
