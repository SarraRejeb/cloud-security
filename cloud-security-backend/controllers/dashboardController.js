const QuizResult = require('../models/QuizResult');
const { generatePDF } = require('../utils/pdfGenerator');

exports.getDashboardData = async (req, res) => {
  try {
    const latestResult = await QuizResult.findOne({
      where: { UserId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    if (!latestResult) {
      return res.status(404).json({ error: 'Aucun résultat trouvé' });
    }
    res.json({
      riskScore: latestResult.riskScore,
      recommendations: latestResult.recommendations,
      owaspIssues: latestResult.owaspIssues,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateRecommendation = async (req, res) => {
  try {
    const { resultId, recommendationIndex, completed, note } = req.body;
    const result = await QuizResult.findByPk(resultId);
    if (!result || result.UserId !== req.user.id) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }
    result.recommendations[recommendationIndex].completed = completed;
    result.recommendations[recommendationIndex].note = note;
    await result.save();
    res.json({ message: 'Recommandation mise à jour' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.exportPDF = async (req, res) => {
  try {
    const latestResult = await QuizResult.findOne({
      where: { UserId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    if (!latestResult) {
      return res.status(404).json({ error: 'Aucun résultat trouvé' });
    }
    generatePDF({
      riskScore: latestResult.riskScore,
      recommendations: latestResult.recommendations,
      owaspIssues: latestResult.owaspIssues,
    }, res);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};