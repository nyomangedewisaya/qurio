const express = require('express');
const { getDashboardStats, forceDeleteQuiz, deleteUser } = require('../controllers/adminController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authenticate);
router.use(authorize('ADMIN'));

router.get('/dashboard', getDashboardStats);
router.delete('/quizzes/:quizId', forceDeleteQuiz);
router.delete('/users/:userId', deleteUser);

module.exports = router;