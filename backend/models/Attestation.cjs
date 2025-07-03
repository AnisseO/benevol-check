const mongoose = require('mongoose');

const attestationSchema = new mongoose.Schema({
  benevoleId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nomBenevole: String,
  emailBenevole: String,
  nomAssociation: String,
  dateDebut: Date,
  dateFin: Date,
  description: String,
  validee: { type: Boolean, default: false },
  dateValidation: Date,
  idResponsable: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  evaluationComportements: {
    I: [Boolean],   // Comportement dans l’action, 4 cases
    II: [Boolean],  // Avec les autres bénévoles, 4 cases
    III: [Boolean], // Vis-à-vis de l’association, 4 cases
  },
  dateDemande: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Attestation', attestationSchema);
