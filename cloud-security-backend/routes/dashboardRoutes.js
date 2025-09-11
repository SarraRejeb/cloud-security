const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

router.get('/data', auth, dashboardController.getDashboardData);
router.put('/recommendations', auth, dashboardController.updateRecommendation);
router.get('/export-pdf', auth, dashboardController.exportPDF);

module.exports = router;