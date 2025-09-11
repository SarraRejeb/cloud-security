// routes/googleDriveRoutes.js
const express = require('express');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:5000/api/google/callback"
);

// 1. Rediriger l’utilisateur vers le consentement Google
router.get('/login', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive.file'],
  });
  res.redirect(url);
});

// 2. Callback après autorisation Google
router.get('/callback', async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  const drive = google.drive({ version: 'v3', auth: oauth2Client });

  const filePath = path.join(__dirname, '../generated/report.pdf'); // 🔁 Change ce chemin selon ton fichier

  const response = await drive.files.create({
    requestBody: {
      name: 'rapport-securite.pdf',
      mimeType: 'application/pdf',
    },
    media: {
      mimeType: 'application/pdf',
      body: fs.createReadStream(filePath),
    },
  });

  res.send(`✅ Rapport uploadé avec succès dans votre Drive ! ID: ${response.data.id}`);
});

module.exports = router;
