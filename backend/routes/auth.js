import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const router = express.Router();

// Inscription
router.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const user = new User({
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role
    });
    await user.save();
    res.status(201).json({ message: "Utilisateur créé !" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return res.status(401).json({ message: "Mot de passe incorrect" });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, userId: user._id, role: user.role });
});

export default router;