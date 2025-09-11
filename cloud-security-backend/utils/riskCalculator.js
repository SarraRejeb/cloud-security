const questions = require('./questions');

exports.calculateRiskScore = (answers) => {
  let totalScore = 0;
  let maxScore = 0;
  let recommendations = [];
  let owaspIssues = new Set();

  for (const question of questions) {
    const userAnswer = answers[question.id];
    const positive = question.inverse ? !userAnswer : userAnswer;

    if (positive) {
      totalScore += question.riskWeight;
    } else {
      recommendations.push(question.recommendation);
      if (question.owasp) {
        question.owasp.forEach((faille) => owaspIssues.add(faille));
      }
    }
    maxScore += question.riskWeight;
  }

  const riskScore = Math.round((totalScore / maxScore) * 100);
  return { riskScore, recommendations, owaspIssues: Array.from(owaspIssues) };
};