require('dotenv').config();

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
app.use('/api/attestations', attestationRoutes);

app.use((req, res, next) => {
  console.log('REQ:', req.method, req.url, req.headers.origin);
  next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur le port ${PORT}`);
});
