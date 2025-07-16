const express = require('express');
const router = express.Router();
const Attestation = require('../models/Attestation.cjs');
const PDFDocument = require('pdfkit');

// Créer une attestation
router.post('/', async (req, res) => {
  try {
    const {
      benevoleId,
      nomBenevole,
      emailBenevole,
      nomAssociation,
      dateDebut,
      dateFin,
      description,
      evaluationComportements
    } = req.body;

    const attestation = new Attestation({
      benevoleId,
      nomBenevole,
      emailBenevole,
      nomAssociation,
      dateDebut,
      dateFin,
      description,
      evaluationComportements,
      validee: false, // statut en attente
      dateDemande: new Date()
    });
    await attestation.save();
    res.status(201).json(attestation);
  } catch (err) {
    console.error(err); 
    res.status(500).json({ message: "Erreur lors de la création de l’attestation." });
  }
});

// Lister toutes les attestations d’un utilisateur (responsable)
router.get('/demandes', async (req, res) => {
  try {
    const demandes = await Attestation.find({ validee: false });
    res.json(demandes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la récupération des demandes." });
  }
});

// Valider une attestation (par responsable)
router.patch('/:id/valider', async (req, res) => {
  try {
    // On attend evaluationComportements dans le body
    const { evaluationComportements } = req.body || {};
    if (!evaluationComportements) {
      return res.status(400).json({ message: "Champ evaluationComportements manquant dans le body." });
    }
    const idResponsable = req.user?._id; 
    const attestation = await Attestation.findByIdAndUpdate(
      req.params.id,
      {
        validee: true,
        dateValidation: new Date(),
        evaluationComportements, // On met à jour ce champ si modifié
        idResponsable
      },
      { new: true }
    );
    res.json(attestation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la validation." });
  }
});

// Refuser (supprimer) une attestation
router.delete('/:id', async (req, res) => {
  try {
    await Attestation.findByIdAndDelete(req.params.id);
    res.json({ message: "Attestation supprimée." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la suppression." });
  }
});

// Lister toutes les attestations d’un utilisateur (bénévole)
router.get('/benevole/:benevoleId', async (req, res) => {
  try {
    const { benevoleId } = req.params;
    const attestations = await Attestation.find({ benevoleId });
    res.json(attestations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la récupération des attestations." });
  }
});

// Lister toutes les attestations validées (responsable)
router.get('/validees/:idResponsable', async (req, res) => {
  try {
    const idResponsable = req.params.idResponsable;
    const attestations = await Attestation.find({
      validee: true,
      idResponsable: idResponsable
    }).sort({ dateValidation: -1 });
    res.json(attestations);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des attestations validées." });
  }
});


// Génération du PDF
router.get('/:id/pdf', async (req, res) => {
  try {
    const att = await Attestation.findById(req.params.id);
    if (!att) return res.status(404).send("Attestation non trouvée.");
    if (!att.validee) return res.status(403).send("Attestation non validée.");
    const evaluation = att.evaluationComportements || { I: [], II: [], III: [] };
    
    // Créer le PDF
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=attestation_${att._id}.pdf`);

    doc.pipe(res);

    doc.fontSize(20).text('Attestation de bénévolat', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Nom du bénévole : ${att.nomBenevole || ''}`);
    doc.text(`Email du bénévole : ${att.emailBenevole || ''}`);
    doc.text(`Nom de l'association : ${att.nomAssociation || ''}`);
    doc.text(`Mission : ${att.description || ''}`);
    doc.text(`Période : du ${new Date(att.dateDebut).toLocaleDateString()} au ${new Date(att.dateFin).toLocaleDateString()}`);
    doc.moveDown();
    ["I", "II", "III"].forEach(axe => {
    doc.fontSize(13).fillColor("black").text(`Axe ${axe} :`, { underline: true, continued: false });
    let auMoinsUn = false;
    evaluation[axe]?.forEach((coche, idx) => {
      if (coche) {
        doc.fontSize(11).fillColor("black").text(`• ${AXES[axe][idx]}`, { indent: 20 });
        auMoinsUn = true;
      }
    });
    if (!auMoinsUn) {
      doc.fontSize(11).fillColor("gray").text("Aucune case cochée", { indent: 20 });
    }
    doc.moveDown();
    });

    doc.text(`Validée le : ${att.dateValidation ? new Date(att.dateValidation).toLocaleDateString() : ''}`);
    doc.moveDown(2);
    doc.text("Signature du responsable :", { align: 'right' });
    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la génération du PDF.");
  }
});

const AXES = {
  I: [
    "Il a bien compris en quoi consistait sa mission pour en maîtriser la pratique",
    "Il a exercé son activité sans avoir besoin d'une supervision",
    "Il a réagi avec pertinence pour modifier sa façon de faire face aux problèmes rencontrés",
    "Il a proposé des idées pour rendre son activité plus efficace ou plus conviviale."
  ],
  II: [
    "Il a facilement trouvé sa place parmi les autres membres du groupe",
    "Dans son action, il a tenu compte de l'activité des autres membres de son équipe",
    "Dans les moments de tension, il a su se mettre à la place de l'autre pour comprendre son point de vue et éviter les conflits",
    "Il a montré des capacités pour motiver l'activité des autres et les solliciter en leur apportant si nécessaire un conseil ou un appui."
  ],
  III: [
    "Il a exercé son activité dans le respect des règles, de pratiques et des valeurs de l'association",
    "Il s'est senti personnellement concerné par la bonne réalisation des tâches ou la conduite des projets jusqu'à leur accomplissement",
    "Il s'est intéressé à la vie de l'association, à son projet associatif et à ses diverses activités.",
    "Il s'est montré prêt à prendre des responsabilités dans l'animation, la vie collective ou le développement de l'association."
  ]
};


module.exports = router;
