const mongoose = require('mongoose');

const attestationSchema = new mongoose.Schema({
  benevoleId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  responsableId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  association: String,
  nomSignataire: String,
  dateDebut: Date,
  dateFin: Date,
  descriptionMission: String,
  comportements: [String], // ou un objet selon le détail
  validee: { type: Boolean, default: false },
  dateValidation: Date,
}, { timestamps: true });

module.exports = mongoose.model('Attestation', attestationSchema);
