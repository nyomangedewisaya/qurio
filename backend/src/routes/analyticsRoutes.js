const express = require('express');
const { getQuizAnalytics, getAttemptDetails, getAuthorDashboard } = require('../controllers/analyticsController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authenticate);
router.use(authorize('AUTHOR', 'ADMIN'));

router.get('/quiz/:quizId', getQuizAnalytics);
router.get('/attempt/:attemptId', getAttemptDetails);
router.get('/author/dashboard', getAuthorDashboard);

module.exports = router;