const jsPDF = require('jspdf');
const autoTable = require('jspdf-autotable');

exports.generatePDF = (data, res) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('Rapport de Sécurité', 20, 20);
  let y = 40;

  doc.setFontSize(14);
  doc.text('Score de Sécurité', 20, y);
  doc.setFontSize(12);
  doc.text(`Score: ${data.riskScore}%`, 20, y + 10);
  y += 30;

  autoTable(doc, {
    startY: y,
    head: [['Recommandation', 'Statut', 'Note']],
    body: data.recommendations.map((rec) => [
      rec.text,
      rec.completed ? 'Terminé' : 'En attente',
      rec.note || '',
    ]),
  });

  y = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.text('Failles OWASP détectées', 20, y);
  autoTable(doc, {
    startY: y + 10,
    head: [['Faille', 'Description', 'Lien']],
    body: data.owaspIssues.map((item) => {
      const faille = require('./owaspMap')[item] || { label: item, description: '', link: '' };
      return [faille.label, faille.description, faille.link];
    }),
  });

  const pdfBuffer = doc.output('buffer');
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=rapport_securite_cloud.pdf');
  res.send(pdfBuffer);
};