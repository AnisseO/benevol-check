const mongoose = require('mongoose');
require('dotenv').config();


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connexion MongoDB réussie'))
.catch((err) => console.log('Erreur connexion MongoDB:', err));

console.log('Environnement:', process.env.NODE_ENV);
console.log('Port:', process.env.PORT);

const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors({
  origin: '*',
  credentials: true, 
}));

app.use(express.json());

const authRoutes = require('./routes/auth.cjs');
const attestationRoutes = require('./routes/attestation.cjs');

app.use('/api/auth', authRoutes);
app.use('/api/attestation', attestationRoutes);

app.use((req, res, next) => {
  console.log('REQ:', req.method, req.url, req.headers.origin);
  next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur le port ${PORT}`);
});
