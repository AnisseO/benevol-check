import React, { useEffect, useState, useContext } from 'react';
import { getDemandesEnAttente, validerAttestation, refuserAttestation } from '../services/attestations';
import { AuthContext } from '../context/AuthContext';
import SearchBar from '../components/SearchhBar';

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


const AttestationsDemandes = () => {
  
  const { user } = useContext(AuthContext);
  const [attestations, setAttestations] = useState([]);
  const [opened, setOpened] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [commentaire, setCommentaire] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");


  useEffect(() => {
    const fetch = async () => {
      const data = await getDemandesEnAttente();
      setAttestations(data || []);
    };
    fetch();
  }, []);

  // Quand on déroule, on initialise le state d’évaluation à l’auto-éval du bénévole
  const handleOpen = (att) => {
    setOpened(opened === att._id ? null : att._id);
    setEvaluation(att.evaluationComportements ? {...att.evaluationComportements} : {
      I: [false, false, false, false],
      II: [false, false, false, false],
      III: [false, false, false, false]
    });
  };

  const handleValider = async (att) => {
    await validerAttestation(att._id, evaluation, commentaire, user._id);
    alert("Attestation validée avec succès !");
    // Refresh liste
    const data = await getDemandesEnAttente();
    setAttestations(data || []);
    setOpened(null);
    setEvaluation(null);
  };

  const handleRefuser = async (att) => {
    if(window.confirm("Confirmer le refus de cette attestation ?")) {
      await refuserAttestation(att._id);
      // Refresh liste
      const data = await getDemandesEnAttente();
      setAttestations(data || []);
    }
  };

  // Filtrage par nom du bénévole
  const filteredAttestations = attestations.filter((att) =>
    att.nomBenevole?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 16 }}>

      <h2>Demandes à valider</h2>

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
                </span>
                <button
                  onClick={() =>
                    setOpened(opened === att._id ? null : att._id)
                  }
                >
                  {opened === att._id ? "Fermer" : "Détails"}
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
                    <b>Période :</b>{" "}
                    {new Date(att.dateDebut).toLocaleDateString()} au{" "}
                    {new Date(att.dateFin).toLocaleDateString()}
                  </div>

                  {/* Formulaire d’évaluation éditable */}
                  <div style={{ marginTop: 8 }}>
                    <b>Évaluation à cocher :</b>
                    {Object.entries(AXES).map(([axe, criteres]) => (
                      <fieldset
                        key={axe}
                        style={{ marginBottom: "1em", border: "none" }}
                      >
                        <legend>
                          <strong>{AXE_LABELS[axe]}</strong>
                        </legend>
                        {criteres.map((critere, idx) => (
                          <label
                            key={critere}
                            style={{ display: "block", marginBottom: 3 }}
                          >
                            <input
                              type="checkbox"
                              checked={evaluation?.[axe]?.[idx] || false}
                              onChange={(e) => {
                                setEvaluation((prev) => ({
                                  ...prev,
                                  [axe]: prev[axe].map((val, i) =>
                                    i === idx ? e.target.checked : val
                                  ),
                                }));
                              }}
                            />
                            {" " + critere}
                          </label>
                        ))}
                      </fieldset>
                    ))}
                  </div>

                  {/* Commentaire */}
                  <textarea
                    placeholder="Ajouter un commentaire..."
                    value={commentaire}
                    onChange={(e) => setCommentaire(e.target.value)}
                    style={{
                      width: "100%",
                      padding: 8,
                      marginBottom: 12,
                      borderRadius: 6,
                      border: "1px solid #ccc",
                    }}
                  />

                  <div>
                    <button
                      onClick={() => handleValider(att)}
                      style={{ marginRight: 8 }}
                    >
                      Valider
                    </button>
                    <button onClick={() => handleRefuser(att._id)}>
                      Refuser
                    </button>
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

export default AttestationsDemandes;
