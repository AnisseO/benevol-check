import './styles/App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Inscription from './pages/Inscription';
import Connexion from './pages/Connexion';
import TableauDeBord from './pages/TableauDeBord';
import RemplirAttestation from './pages/RemplirAttestation';
import AttestationsDemandes from './pages/AttestationEnAttente';
import Attestations from './pages/Attestation';
import AttestationsValidees from './pages/AttestationsValidees';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Connexion />} />
        <Route path='/inscription' element={<Inscription/>} />
        <Route path="/tableau-de-bord" element={<TableauDeBord />}/>
        <Route path="/remplir-attestation" element={<RemplirAttestation />} />
        <Route path="/attestations" element={<Attestations />} />
        <Route path="/attestations-demandes" element={<AttestationsDemandes />} />
        <Route path="/attestations-validees" element={<AttestationsValidees />} />
      </Routes>
    </Router>
  );
}

export default App;

