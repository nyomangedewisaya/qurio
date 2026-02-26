const prisma = require('../config/database');

/**
 * @route   POST /api/attempts/start/:quizId
 * @desc    Participant memulai kuis
 * @access  Private (Participant)
 */
const startQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { pin } = req.body;
    const participantId = req.user.id;

    const quiz = await prisma.quiz.findUnique({ where: { id: quizId } });

    if (!quiz || quiz.status !== 'PUBLISHED') {
      return res.status(404).json({ success: false, message: 'Kuis tidak tersedia.' });
    }

    if (quiz.pin && quiz.pin !== pin) {
      return res.status(401).json({ success: false, message: 'PIN kuis salah.' });
    }

    const now = new Date();
    if (quiz.startDate && now < new Date(quiz.startDate)) {
      return res.status(403).json({ success: false, message: 'Kuis ini belum dimulai sesuai jadwal.' });
    }
    if (quiz.endDate && now > new Date(quiz.endDate)) {
      return res.status(403).json({ success: false, message: 'Waktu pengerjaan kuis ini sudah ditutup.' });
    }

    const previousAttempts = await prisma.quizAttempt.count({
      where: { quizId, participantId }
    });

    if (previousAttempts >= quiz.maxAttempts) {
      return res.status(403).json({ success: false, message: 'Anda telah mencapai batas maksimal pengerjaan kuis ini.' });
    }

    const attempt = await prisma.quizAttempt.create({
      data: { quizId, participantId }
    });

    res.status(201).json({ success: true, message: 'Kuis dimulai', data: attempt });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memulai kuis', error: error.message });
  }
};

/**
 * @route   POST /api/attempts/:attemptId/answer
 * @desc    Simpan jawaban satu per satu (Auto-save)
 * @access  Private (Participant)
 */
const saveAnswer = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { questionId, optionId } = req.body;

    const attempt = await prisma.quizAttempt.findUnique({ 
      where: { id: attemptId },
      include: { quiz: true } 
    });

    if (!attempt || attempt.completedAt) {
      return res.status(400).json({ success: false, message: 'Sesi kuis tidak valid atau sudah selesai.' });
    }

    if (attempt.quiz.timeLimit) {
      const timeLimitMs = attempt.quiz.timeLimit * 60 * 1000;
      const elapsedTimeMs = Date.now() - new Date(attempt.startedAt).getTime();
      
      if (elapsedTimeMs > (timeLimitMs + 15000)) {
        return res.status(403).json({ success: false, message: 'Waktu pengerjaan sudah habis! Jawaban ditolak.' });
      }
    }

    const option = await prisma.option.findUnique({ where: { id: optionId } });
    const isCorrect = option ? option.isCorrect : false;

    const existingAnswer = await prisma.answer.findFirst({
      where: { attemptId, questionId }
    });

    let answer;
    if (existingAnswer) {
      answer = await prisma.answer.update({
        where: { id: existingAnswer.id },
        data: { optionId, isCorrect }
      });
    } else {
      answer = await prisma.answer.create({
        data: { attemptId, questionId, optionId, isCorrect }
      });
    }

    res.status(200).json({ success: true, message: 'Jawaban tersimpan', data: answer });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menyimpan jawaban', error: error.message });
  }
};

/**
 * @route   POST /api/attempts/:attemptId/finish
 * @desc    Akhiri kuis dan hitung skor otomatis
 * @access  Private (Participant)
 */
const finishQuiz = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const attempt = await prisma.quizAttempt.findUnique({
      where: { id: attemptId },
      include: { answers: true, quiz: { include: { questions: true } } }
    });

    if (!attempt || attempt.completedAt) {
      return res.status(400).json({ success: false, message: 'Sesi kuis tidak valid atau sudah diselesaikan.' });
    }

    const totalQuestions = attempt.quiz.questions.length;
    const correctAnswers = attempt.answers.filter(ans => ans.isCorrect).length;
    const calculatedScore = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    const finishedAttempt = await prisma.quizAttempt.update({
      where: { id: attemptId },
      data: {
        score: calculatedScore,
        completedAt: new Date()
      }
    });

    res.status(200).json({ 
      success: true, 
      message: 'Kuis berhasil disubmit.', 
      data: { 
        attemptId: finishedAttempt.id,
        completedAt: finishedAttempt.completedAt,
        score: attempt.quiz.showScore ? finishedAttempt.score : null, 
        showScore: attempt.quiz.showScore
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menyelesaikan kuis', error: error.message });
  }
};

/**
 * @route   GET /api/attempts/my-history
 * @desc    Melihat riwayat kuis yang pernah dikerjakan oleh Participant
 * @access  Private (Participant)
*/
const getMyHistory = async (req, res) => {
  try {
    const history = await prisma.quizAttempt.findMany({
      where: { participantId: req.user.id },
      orderBy: { startedAt: 'desc' },
      include: {
        quiz: {
          select: { title: true, slug: true, showScore: true }
        }
      }
    });

    const formattedHistory = history.map(h => ({
      attemptId: h.id,
      quizTitle: h.quiz.title,
      slug: h.quiz.slug,
      score: h.quiz.showScore ? h.score : 'Disembunyikan',
      startedAt: h.startedAt,
      completedAt: h.completedAt,
      status: h.completedAt ? 'Selesai' : 'Belum Selesai'
    }));

    res.status(200).json({ success: true, data: formattedHistory });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil riwayat', error: error.message });
  }
};

/**
 * @route   GET /api/attempts/:attemptId/review
 * @desc    Peserta melihat detail jawaban benar/salah setelah ujian
 * @access  Private (Participant)
 */
const getAttemptReview = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const attempt = await prisma.quizAttempt.findUnique({
      where: { id: attemptId, participantId: req.user.id }, 
      include: {
        quiz: { select: { title: true, showScore: true } },
        answers: {
          include: {
            question: { select: { content: true, type: true } },
            option: { select: { content: true, isCorrect: true } }
          }
        }
      }
    });

    if (!attempt || !attempt.completedAt) {
      return res.status(404).json({ success: false, message: 'Data tidak ditemukan atau kuis belum disubmit.' });
    }

    if (!attempt.quiz.showScore) {
      return res.status(403).json({ 
        success: false, 
        message: 'Review tidak diizinkan. Instruktur menyembunyikan hasil kuis ini.' 
      });
    }

    res.status(200).json({ success: true, data: attempt });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memuat review', error: error.message });
  }
};

module.exports = { startQuiz, saveAnswer, finishQuiz, getMyHistory, getAttemptReview };