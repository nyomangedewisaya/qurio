const prisma = require('../config/database');

/**
 * @route   GET /api/admin/dashboard
 * @desc    Melihat statistik global aplikasi
 * @access  Private (Hanya ADMIN)
 */
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalAuthors = await prisma.user.count({ where: { role: 'AUTHOR' } });
    const totalQuizzes = await prisma.quiz.count();
    const totalAttempts = await prisma.quizAttempt.count();

    res.status(200).json({
      success: true,
      data: { totalUsers, totalAuthors, totalQuizzes, totalAttempts }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memuat dashboard', error: error.message });
  }
};

/**
 * @route   DELETE /api/admin/quizzes/:quizId
 * @desc    Admin menghapus kuis milik siapa saja yang melanggar aturan
 * @access  Private (Hanya ADMIN)
 */
const forceDeleteQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    await prisma.quiz.delete({ where: { id: quizId } });
    
    res.status(200).json({ success: true, message: 'Kuis berhasil dihapus secara paksa oleh Admin.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menghapus kuis', error: error.message });
  }
};

/**
 * @route   DELETE /api/admin/users/:userId
 * @desc    Admin menghapus (ban/kick) user dari sistem
 * @access  Private (Hanya ADMIN)
 */
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (userId === req.user.id) {
      return res.status(400).json({ success: false, message: 'Anda tidak bisa menghapus akun Anda sendiri.' });
    }

    await prisma.user.delete({ where: { id: userId } });
    res.status(200).json({ success: true, message: 'User berhasil dihapus/dibanned dari sistem.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menghapus user', error: error.message });
  }
};

module.exports = { getDashboardStats, forceDeleteQuiz, deleteUser };