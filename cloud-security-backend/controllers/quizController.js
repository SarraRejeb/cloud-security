const QuizResult = require('../models/QuizResult');
const { calculateRiskScore } = require('../utils/riskCalculator');
const questions = require('../utils/questions'); 


exports.submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;
    const UserId = req.user.id;

    const { riskScore, recommendations, owaspIssues } = calculateRiskScore(answers);

    const quizResult = await QuizResult.create({
      UserId,
      riskScore,
      recommendations: recommendations.map((rec) => ({ text: rec, completed: false, note: '' })),
      owaspIssues,
    });

    const questions = require('../utils/questions');


    res.json({ riskScore, recommendations, owaspIssues });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getQuizHistory = async (req, res) => {
  try {
    const results = await QuizResult.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.json(results);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
 
exports.getQuestions = (req, res) => {
  res.json(questions);
 };