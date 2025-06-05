const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['bénévole', 'responsable'], default: 'bénévole' }
});

module.exports = mongoose.model('User', userSchema);