require('dotenv').config();

console.log('Environnement:', process.env.NODE_ENV);
console.log('Port:', process.env.PORT);

const authRoutes = require('./routes/auth.cjs');
const attestationRoutes = require('./routes/attestation.cjs');

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/attestations', attestationRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur le port ${PORT}`);
});
