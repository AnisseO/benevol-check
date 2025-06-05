const mongoose = require('mongoose');

const attestationSchema = new mongoose.Schema({
  benevoleId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  nomBenevole: String,
  emailBenevole: String,
  nomAssociation: String,
  dateDebut: Date,
  dateFin: Date,
  description: String,
  validee: { type: Boolean, default: false },
  dateDemande: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Attestation", attestationSchema);
