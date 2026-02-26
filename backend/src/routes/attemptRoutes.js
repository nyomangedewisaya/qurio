const express = require('express');
const { startQuiz, saveAnswer, finishQuiz, getMyHistory, getAttemptReview } = require('../controllers/attemptController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authenticate);

router.get('/my-history', getMyHistory);
router.post('/start/:quizId', startQuiz);
router.post('/:attemptId/answer', saveAnswer);
router.post('/:attemptId/finish', finishQuiz);
router.get('/:attemptId/review', getAttemptReview);

module.exports = router;