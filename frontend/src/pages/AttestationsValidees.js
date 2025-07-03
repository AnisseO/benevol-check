import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const AttestationsValidees = () => {
  const { user } = useContext(AuthContext);
  const [attestations, setAttestations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (user && user._id) {
        const res = await axios.get(`http://localhost:5000/api/attestation/validees/${user._id}`);
        setAttestations(res.data);
      }
    };
    fetchData();
  }, [user]);

  return (
    <div style={{ padding: 16 }}>
      <h2>Attestations validées par moi</h2>
      {attestations.length === 0 ? (
        <p>Aucune attestation validée.</p>
      ) : (
        <ul>
          {attestations.map(att => (
            <li key={att._id} style={{ marginBottom: 16 }}>
              <strong>{att.nomBenevole}</strong> — {att.nomAssociation}
              <br />
              Période : {new Date(att.dateDebut).toLocaleDateString()} au {new Date(att.dateFin).toLocaleDateString()}
              <br />
              <span style={{ color: "#a7ce3a", fontWeight: "bold" }}>Validée le {att.dateValidation ? new Date(att.dateValidation).toLocaleDateString() : "?"}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AttestationsValidees;
