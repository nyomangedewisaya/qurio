const express = require('express');
const { getDashboardStats, forceDeleteQuiz, deleteUser, getUsers, updateUser, getQuizzes, getQuizBySlug, getGlobalAttempts, getAttemptDetail, getAdminProfile, updateAdminProfile, updateAdminPassword } = require('../controllers/adminController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authenticate);
router.use(authorize('ADMIN'));

router.get('/dashboard', getDashboardStats);
router.delete('/quizzes/:quizId', forceDeleteQuiz);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:userId', deleteUser);
router.get('/quizzes', getQuizzes);
router.get('/quizzes/:slug', getQuizBySlug);
router.get('/attempts', getGlobalAttempts);
router.get('/attempts/:attemptId', getAttemptDetail);
router.get('/settings/profile', getAdminProfile);
router.put('/settings/profile', updateAdminProfile);
router.put('/settings/password', updateAdminPassword);

module.exports = router;