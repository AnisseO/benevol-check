import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createAttestation } from '../services/attestations';

const RemplirAttestation = () => {
  const [association, setAssociation] = useState('');
  const [benevole, setBenevole] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Envoyer les données au backend
  };

  return (
    <div>
      <h1>Remplir une attestation</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Association"
          value={association}
          onChange={(e) => setAssociation(e.target.value)}
        />
        <input
          type="text"
          placeholder="Bénévole"
          value={benevole}
          onChange={(e) => setBenevole(e.target.value)}
        />
        <input
          type="date"
          value={dateDebut}
          onChange={(e) => setDateDebut(e.target.value)}
        />
        <input
          type="date"
          value={dateFin}
          onChange={(e) => setDateFin(e.target.value)}
        />
        <textarea
          placeholder="Description de la mission"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Soumettre</button>
      </form>
    </div>
  );
};

export default function RemplirAttestation() {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      await createAttestation(data);
      alert('Attestation enregistrée !');
    } catch (error) {
      console.error("Erreur :", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("nomAssociation")} placeholder="Nom de l'association" />
      {/* Ajoutez tous les champs nécessaires ici */}
      <button type="submit">Soumettre</button>
    </form>
  );
}