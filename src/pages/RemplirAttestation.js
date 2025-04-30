import React, { useState } from 'react';

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

export default RemplirAttestation;