const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.cjs');

// Inscription
router.post('/register', async (req, res) => {
  console.log('Tentative inscription :', req.body); 
  try {
    const { nom, email, password, role } = req.body;
    if (!nom || !email || !password || !role) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires." });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email déjà utilisé." });

    const hash = await bcrypt.hash(password, 10);

    const user = new User({
      nom,
      email,
      password: hash,
      role
    });
    await user.save();
    res.status(201).json({ message: "Inscription réussie !" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  console.log('Tentative de connexion :', req.body); 
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return res.status(401).json({ message: "Mot de passe incorrect" });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
  return res.json({ token, user: { email: user.email, role: user.role, nom: user.nom, _id: user._id } });
});

module.exports = router;
