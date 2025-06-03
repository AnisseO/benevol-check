const express = require('express');
const router = express.Router();
const Attestation = require('../models/Attestation');

// Créer une attestation
router.post('/', async (req, res) => {
  try {
    const attestation = new Attestation(req.body);
    await attestation.save();
    res.status(201).json(attestation);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création de l’attestation' });
  }
});

// Lister toutes les attestations d’un utilisateur (bénévole)
router.get('/:userId', async (req, res) => {
  try {
    const attestations = await Attestation.find({ benevoleId: req.params.userId });
    res.status(200).json(attestations);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des attestations' });
  }
});

// Valider une attestation (par responsable)
router.put('/valider/:id', async (req, res) => {
  try {
    const attestation = await Attestation.findByIdAndUpdate(
      req.params.id,
      { validee: true, dateValidation: new Date() },
      { new: true }
    );
    res.status(200).json(attestation);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la validation de l’attestation" });
  }
});

module.exports = router;
