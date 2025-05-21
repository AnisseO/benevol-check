const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors()); // Autorise les requêtes du frontend

// Route test
app.get('/api/test', (req, res) => {
  res.json({ message: "Backend connecté avec succès !" });
});

app.listen(5000, () => {
  console.log('Backend running on http://localhost:5000');
});