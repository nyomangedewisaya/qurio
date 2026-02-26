const prisma = require('../config/database');

/**
 * @route   GET /api/analytics/quiz/:quizId
 * @desc    Mendapatkan statistik lengkap dan Leaderboard untuk satu kuis
 * @access  Private (Author/Admin)
 */
const getQuizAnalytics = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      select: { id: true, title: true, authorId: true }
    });

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Kuis tidak ditemukan.' });
    }

    if (quiz.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Akses ditolak. Anda bukan pemilik kuis ini.' });
    }

    const attempts = await prisma.quizAttempt.findMany({
      where: { 
        quizId, 
        completedAt: { not: null }
      },
      include: {
        participant: { select: { id: true, name: true, username: true } }
      }
    });

    if (attempts.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Belum ada data pengerjaan untuk kuis ini.',
        data: { totalAttempts: 0, averageScore: 0, highestScore: 0, lowestScore: 0, leaderboard: [] }
      });
    }

    const scores = attempts.map(a => a.score);
    const totalAttempts = attempts.length;
    const averageScore = scores.reduce((a, b) => a + b, 0) / totalAttempts;
    const highestScore = Math.max(...scores);
    const lowestScore = Math.min(...scores);

    const leaderboard = attempts.map(attempt => {
      const durationMs = new Date(attempt.completedAt).getTime() - new Date(attempt.startedAt).getTime();
      const durationMinutes = (durationMs / 1000 / 60).toFixed(2); 

      return {
        attemptId: attempt.id,
        participant: attempt.participant.name,
        username: attempt.participant.username,
        score: attempt.score,
        durationMinutes: parseFloat(durationMinutes),
        completedAt: attempt.completedAt
      };
    }).sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.durationMinutes - b.durationMinutes; 
    });

    res.status(200).json({
      success: true,
      data: {
        quizTitle: quiz.title,
        totalAttempts,
        averageScore: parseFloat(averageScore.toFixed(2)),
        highestScore,
        lowestScore,
        leaderboard
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data analitik', error: error.message });
  }
};

/**
 * @route   GET /api/analytics/attempt/:attemptId
 * @desc    Melihat detail jawaban dari satu attempt secara spesifik (Soal mana yang salah/benar)
 * @access  Private (Author/Admin)
 */
const getAttemptDetails = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const attempt = await prisma.quizAttempt.findUnique({
      where: { id: attemptId },
      include: {
        participant: { select: { name: true, username: true } },
        quiz: { select: { title: true, authorId: true } },
        answers: {
          include: {
            question: { select: { content: true, type: true } },
            option: { select: { content: true } }
          }
        }
      }
    });

    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Data pengerjaan tidak ditemukan.' });
    }

    if (attempt.quiz.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Akses ditolak.' });
    }

    res.status(200).json({ success: true, data: attempt });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil detail pengerjaan', error: error.message });
  }
};

/**
 * @route   GET /api/analytics/author/dashboard
 * @desc    Mendapatkan rangkuman metrik & data grafik tingkat lanjut untuk Dashboard Author
 * @access  Private (Author/Admin)
 */
const getAuthorDashboard = async (req, res) => {
  try {
    const authorId = req.user.id;
    const PASSING_SCORE = 70;

    const allAttempts = await prisma.quizAttempt.findMany({
      where: { 
        quiz: { authorId },
        completedAt: { not: null } 
      },
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

    const totalQuizzes = await prisma.quiz.count({ where: { authorId } });
    const activeQuizzes = await prisma.quiz.count({ where: { authorId, status: 'PUBLISHED' } });

    const popularQuizzes = await prisma.quiz.findMany({
      where: { authorId, status: 'PUBLISHED' },
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
      where: { quiz: { authorId }, completedAt: { not: null } },
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

module.exports = { getQuizAnalytics, getAttemptDetails, getAuthorDashboard };