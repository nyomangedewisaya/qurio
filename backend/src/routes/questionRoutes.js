const express = require('express');
const { createQuestion, getQuestionsByQuiz, updateQuestion, deleteQuestion } = require('../controllers/questionController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authenticate); 

router.get('/quiz/:quizId', getQuestionsByQuiz);
router.post('/:quizId', authorize('AUTHOR', 'ADMIN'), createQuestion);
router.put('/:questionId', authorize('AUTHOR', 'ADMIN'), updateQuestion);
router.delete('/:questionId', authorize('AUTHOR', 'ADMIN'), deleteQuestion);

module.exports = router;