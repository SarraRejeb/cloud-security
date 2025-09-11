const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const auth = require('../middleware/auth');

router.post('/submit', auth, quizController.submitQuiz);
router.get('/history', auth, quizController.getQuizHistory);
router.get('/questions', quizController.getQuestions);

module.exports = router;