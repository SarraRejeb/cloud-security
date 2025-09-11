const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const pdfStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "..", "generated");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, "report.pdf");
  },
});

const upload = multer({ storage: pdfStorage });

router.post("/upload-pdf", upload.single("pdf"), (req, res) => {
  res.status(200).json({ message: "PDF sauvegardé avec succès !" });
});

module.exports = router;
