require('dotenv').config();

console.log('Environnement:', process.env.NODE_ENV);
console.log('Port:', process.env.PORT);
const express = require('express');

const app = express();

const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Route test
app.get('/api/test', (req, res) => {
  res.json({ message: "Backend connecté avec succès !" });
});

app.listen(5000, () => {
  console.log('Backend running on http://localhost:5000');
});