const bcrypt = require('bcrypt');
const prisma = require('../config/database');

/**
 * @route   GET /api/admin/dashboard
 * @desc    Melihat statistik global dan analitik seluruh aplikasi
 * @access  Private (Hanya ADMIN)
 */
const getDashboardStats = async (req, res) => {
  try {
    const PASSING_SCORE = 75;

    const totalUsers = await prisma.user.count();
    const totalAuthors = await prisma.user.count({ where: { role: 'AUTHOR' } });
    const totalQuizzes = await prisma.quiz.count();
    const activeQuizzes = await prisma.quiz.count({ where: { status: 'PUBLISHED' } });

    const allAttempts = await prisma.quizAttempt.findMany({
      where: { completedAt: { not: null } },
      select: { score: true, startedAt: true, completedAt: true }
    });

    const totalAttempts = allAttempts.length;

    let totalScore = 0;
    let passedCount = 0;
    let totalDurationMs = 0;

    allAttempts.forEach(attempt => {
      totalScore += attempt.score;
      if (attempt.score >= PASSING_SCORE) passedCount++;
      totalDurationMs += (new Date(attempt.completedAt).getTime() - new Date(attempt.startedAt).getTime());
    });

    const globalAverageScore = totalAttempts > 0 ? parseFloat((totalScore / totalAttempts).toFixed(2)) : 0;
    const passRatePercentage = totalAttempts > 0 ? parseFloat(((passedCount / totalAttempts) * 100).toFixed(2)) : 0;
    const avgDurationMinutes = totalAttempts > 0 ? parseFloat((totalDurationMs / totalAttempts / 60000).toFixed(2)) : 0;

    const popularQuizzes = await prisma.quiz.findMany({
      where: { status: 'PUBLISHED' },
      select: { title: true, _count: { select: { attempts: true } } },
      orderBy: { attempts: { _count: 'desc' } },
      take: 5
    });

    const chartPopularQuizzes = popularQuizzes.map(q => ({
      name: q.title.length > 15 ? q.title.substring(0, 15) + '...' : q.title,
      totalPeserta: q._count.attempts
    }));

    const trendMap = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0]; 
      trendMap[dateStr] = 0;
    }

    allAttempts.forEach(att => {
      const dateStr = new Date(att.completedAt).toISOString().split('T')[0];
      if (trendMap[dateStr] !== undefined) {
        trendMap[dateStr]++;
      }
    });

    const chartTrend = Object.keys(trendMap).map(date => ({
      date: date.substring(5), 
      jumlahPengerjaan: trendMap[date]
    }));

    const recentActivity = await prisma.quizAttempt.findMany({
      where: { completedAt: { not: null } },
      orderBy: { completedAt: 'desc' },
      take: 5,
      select: {
        id: true,
        score: true,
        completedAt: true,
        participant: { select: { name: true } },
        quiz: { select: { title: true } }
      }
    });

    const formattedRecentActivity = recentActivity.map(activity => ({
      attemptId: activity.id,
      participantName: activity.participant.name,
      quizTitle: activity.quiz.title,
      score: activity.score,
      status: activity.score >= PASSING_SCORE ? 'Lulus' : 'Gagal',
      timeAgo: activity.completedAt
    }));

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalUsers,
          totalAuthors,
          totalQuizzes,
          activeQuizzes,
          totalAttempts,
          globalAverageScore,
          passRatePercentage,      
          avgDurationMinutes        
        },
        charts: {
          popularQuizzes: chartPopularQuizzes,  
          engagementTrend: chartTrend          
        },
        recentActivity: formattedRecentActivity
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memuat data dashboard', error: error.message });
  }
};

/**
 * @route   DELETE /api/admin/quizzes/:quizId
 * @desc    Admin menghapus paksa kuis beserta relasinya (soal & riwayat percobaan)
 * @access  Private (Hanya ADMIN)
 */
const forceDeleteQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;

    await prisma.quiz.delete({ where: { id: quizId } });
    
    res.status(200).json({ success: true, message: 'Kuis berhasil dihapus permanen.' });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Gagal menghapus kuis. Pastikan semua relasi data sudah sesuai.', 
      error: error.message 
    });
  }
};

/**
 * @route   GET /api/admin/users
 * @desc    Mendapatkan daftar pengguna (Kecuali ADMIN) dengan Pagination, Search, & Filter
 * @access  Private (Hanya ADMIN)
 */
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.q || '';
    const role = req.query.role || 'ALL';

    const skip = (page - 1) * limit;

    const whereClause = {
      ...(role !== 'ALL' && role !== 'ADMIN' ? { role: role } : { role: { not: 'ADMIN' } }),
      
      ...(search && {
        OR: [
          { name: { contains: search } },
          { username: { contains: search } }
        ]
      })
    };

    const [users, totalItems, totalAuthors, totalParticipants] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        skip: skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          username: true,
          role: true,
          phone: true,
          createdAt: true
        }
      }),
      prisma.user.count({ where: whereClause }),
      prisma.user.count({ where: { role: 'AUTHOR' } }),       
      prisma.user.count({ where: { role: 'PARTICIPANT' } })   
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      success: true,
      data: users,
      stats: {
        totalAuthors,
        totalParticipants
      },
      pagination: {
        currentPage: page,
        itemsPerPage: limit,
        totalPages,
        totalItems
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data pengguna', error: error.message });
  }
};

/**
 * @route   PUT /api/admin/users/:id atau /api/admin/users/:userId
 * @desc    Admin mengubah data user (Nama, Username, Phone) - Role tidak bisa diubah
 * @access  Private (Hanya ADMIN)
 */
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id || req.params.userId;
    const { name, username, phone } = req.body;

    console.log(`[DEBUG] Mencoba update user ID: ${userId}`);
    console.log(`[DEBUG] Data payload:`, req.body);

    if (!userId || userId === 'undefined') {
      return res.status(400).json({ success: false, message: 'ID User tidak valid atau tidak ditemukan di URL.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!existingUser) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan di database.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { 
        name, 
        username, 
        phone: phone ? phone : null 
      }
    });

    console.log(`[DEBUG] Update berhasil untuk user:`, updatedUser.username);
    res.status(200).json({ success: true, message: 'Data pengguna berhasil diperbarui', data: updatedUser });

  } catch (error) {

    if (error.code === 'P2002') {
      const target = error.meta?.target;
      return res.status(400).json({ 
        success: false, 
        message: `Data ${target ? target : 'tersebut'} sudah digunakan oleh akun lain.` 
      });
    }

    res.status(500).json({ success: false, message: 'Gagal memperbarui pengguna', error: error.message });
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

/**
 * @route   GET /api/admin/quizzes
 * @desc    Admin melihat seluruh kuis dari semua Instruktur dengan Pagination & Filter
 * @access  Private (Hanya ADMIN)
 */
const getQuizzes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6; 
    const search = req.query.q || '';
    const status = req.query.status || 'ALL';

    const skip = (page - 1) * limit;

    const whereClause = {
      ...(status !== 'ALL' && { status }),
      ...(search && {
        OR: [
          { title: { contains: search } },
          { quizCode: { contains: search } } 
        ]
      })
    };

    const [quizzes, totalItems] = await Promise.all([
      prisma.quiz.findMany({
        where: whereClause,
        skip: skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { 
            select: { id: true, name: true, username: true } 
          },
          _count: { 
            select: { questions: true, attempts: true } 
          }
        }
      }),
      prisma.quiz.count({ where: whereClause })
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      success: true,
      data: quizzes,
      pagination: {
        currentPage: page,
        itemsPerPage: limit,
        totalPages,
        totalItems
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data kuis global', error: error.message });
  }
};

/**
 * @route   GET /api/admin/quizzes/:slug
 * @desc    Admin melihat detail lengkap 1 kuis berdasarkan Slug
 * @access  Private (Hanya ADMIN)
*/
const getQuizBySlug = async (req, res) => {
  try {
    const { slug } = req.params; 

    const quiz = await prisma.quiz.findUnique({
      where: { slug: slug }, 
      include: {
        author: { select: { id: true, name: true, username: true, phone: true } },
        questions: {
          include: { options: true },
          orderBy: { id: 'asc' }
        },
        _count: { select: { attempts: true } }
      }
    });

    if (!quiz) return res.status(404).json({ success: false, message: 'Kuis tidak ditemukan.' });

    res.status(200).json({ success: true, data: quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil detail kuis', error: error.message });
  }
};

/**
 * @route   GET /api/admin/attempts
 * @desc    Admin melihat seluruh jawaban peserta dengan Pagination & Filter
 * @access  Private (Hanya ADMIN)
*/
const getGlobalAttempts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { search, status, startDate, endDate } = req.query;

    let whereClause = {};
    
    if (search) {
      whereClause.OR = [
        { participant: { name: { contains: search } } },
        { quiz: { title: { contains: search } } }
      ];
    }
    
    if (status === 'COMPLETED') {
      whereClause.completedAt = { not: null };
    } else if (status === 'IN_PROGRESS') {
      whereClause.completedAt = null;
    }

    if (startDate && endDate) {
      whereClause.startedAt = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }
    
    const [attempts, totalItems] = await prisma.$transaction([
      prisma.quizAttempt.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { startedAt: 'desc' },
        include: {
          participant: { select: { id: true, name: true, username: true } },
          quiz: { select: { id: true, title: true, quizCode: true, status: true } }
        }
      }),
      prisma.quizAttempt.count({ where: whereClause })
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      success: true,
      data: attempts,
      pagination: { totalItems, totalPages, currentPage: page, limit }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memuat riwayat', error: error.message });
  }
};

/**
 * @route   GET /api/admin/attempts/:attemptId
 * @desc    Admin melihat detail lengkap 1 jawaban siswa
 * @access  Private (Hanya ADMIN)
*/
const getAttemptDetail = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const attempt = await prisma.quizAttempt.findUnique({
      where: { id: attemptId },
      include: {
        participant: { select: { id: true, name: true, username: true } }, 
        quiz: { select: { id: true, title: true, quizCode: true, timeLimit: true } },
        answers: {
          include: {
            question: { include: { options: true } },
            option: true 
          }
        }
      }
    });

    if (!attempt) return res.status(404).json({ success: false, message: 'Riwayat tidak ditemukan' });

    res.status(200).json({ success: true, data: attempt });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memuat detail', error: error.message });
  }
};

/**
 * @route   GET /api/admin/settings/profile
 * @desc    Ambil data profil admin yang sedang login
 * @access  Private (Hanya ADMIN)
 */
const getAdminProfile = async (req, res) => {
  try {
    const admin = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, username: true, role: true }
    });
    res.status(200).json({ success: true, data: admin });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memuat profil', error: error.message });
  }
};

/**
 * @route   PUT /api/admin/settings/profile
 * @desc    Update nama & username admin
 * @access  Private (Hanya ADMIN)
 */
const updateAdminProfile = async (req, res) => {
  try {
    const { name, username } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: { username, id: { not: req.user.id } }
    });

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username sudah digunakan oleh akun lain' });
    }

    const updatedAdmin = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, username },
      select: { id: true, name: true, username: true }
    });

    res.status(200).json({ success: true, message: 'Profil berhasil diperbarui', data: updatedAdmin });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui profil', error: error.message });
  }
};

/**
 * @route   PUT /api/admin/settings/password
 * @desc    Update password admin
 * @access  Private (Hanya ADMIN)
 */
const updateAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Password saat ini salah' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedNewPassword }
    });

    res.status(200).json({ success: true, message: 'Password berhasil diperbarui' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui password', error: error.message });
  }
};

module.exports = { getDashboardStats, forceDeleteQuiz, getUsers, updateUser, deleteUser, getQuizzes, getQuizBySlug, getGlobalAttempts, getAttemptDetail, getAdminProfile, updateAdminProfile, updateAdminPassword };