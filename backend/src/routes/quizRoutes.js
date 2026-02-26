const express = require('express');
const { 
  createQuiz, getMyQuizzes, updateQuiz, deleteQuiz, 
  getPublicQuizzes, getQuizForLobby 
} = require('../controllers/quizController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/public', getPublicQuizzes);
router.use(authenticate);
router.get('/join/:quizCode', getQuizForLobby);
router.post('/', authorize('AUTHOR', 'ADMIN'), createQuiz);
router.get('/my-quizzes', authorize('AUTHOR', 'ADMIN'), getMyQuizzes);
router.put('/:id', authorize('AUTHOR', 'ADMIN'), updateQuiz);
router.delete('/:id', authorize('AUTHOR', 'ADMIN'), deleteQuiz);

module.exports = router;