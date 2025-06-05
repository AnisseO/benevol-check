import React, { useState, useContext } from 'react';
import { AuthContext } from "../context/AuthContext";
import api from "../services/api"; 
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { createAttestation } from '../services/attestations';

const RemplirAttestation = () => {
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nomAssociation: "",
    dateDebut: "",
    dateFin: "",
    description: "",
  });
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      // Appelle l’API d’ajout d’attestation
      await api.post("/attestation", {
        ...form,
        benevoleId: user?._id,
        nomBenevole: user?.nom,
        emailBenevole: user?.email,
      });
      setSuccess("Demande envoyée !");
      setTimeout(() => navigate("/tableau-de-bord"), 1500);
    } catch (err) {
      setError("Erreur lors de la demande.");
    }
  };

  return (
    <div>
      <h1>Remplir une attestation</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nomAssociation"
          placeholder="Association"
          value={form.nomAssociation}
          onChange={handleChange}
          required
        /><br/>
        <input
          type="date"
          name="dateDebut"
          value={form.dateDebut}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="dateFin"
          value={form.dateFin}
          onChange={handleChange}
          required
        /><br/>
        <textarea
          name="description"
          value={form.description}
          placeholder="Description de la mission"
          onChange={handleChange}
          required
        /><br/>
        <button type="submit">Soumettre</button>
      </form>
      {error && <p style={{color:"red"}}>{error}</p>}
      {success && <p style={{color:"green"}}>{success}</p>}
    </div>
  );
};

export default RemplirAttestation ;