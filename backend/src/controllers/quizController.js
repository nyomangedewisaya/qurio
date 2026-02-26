const prisma = require('../config/database');
const crypto = require('crypto');

const generateSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
const generateCode = () =>
  crypto.randomBytes(6).toString('base64')
    .replace(/[^A-Z0-9]/gi, '')
    .substring(0, 10)
    .toUpperCase();

/**
 * @route   POST /api/quizzes
 * @desc    Membuat kuis baru (Draft/Published) beserta generate Slug & Kode otomatis
 * @access  Private (Author/Admin)
 */
const createQuiz = async (req, res) => {
  try {
    const { 
      title, description, timeLimit, status, pin,
      startDate, endDate, showScore, randomizeQuestions, maxAttempts 
    } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Judul kuis wajib diisi.' });
    }

    const baseSlug = generateSlug(title);
    const quizCode = generateCode();

    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        slug: `${baseSlug}-${Date.now()}`,
        quizCode,
        pin: pin || null,
        timeLimit: timeLimit ? parseInt(timeLimit) : null,
        status: status || 'DRAFT',
        authorId: req.user.id,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        showScore: showScore !== undefined ? Boolean(showScore) : true,
        randomizeQuestions: randomizeQuestions !== undefined ? Boolean(randomizeQuestions) : false,
        maxAttempts: maxAttempts ? parseInt(maxAttempts) : 1,
      },
    });

    res.status(201).json({ success: true, message: 'Kuis berhasil dibuat', data: quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal membuat kuis', error: error.message });
  }
};

/**
 * @route   GET /api/quizzes/my-quizzes
 * @desc    Mendapatkan daftar kuis yang dibuat oleh author yang sedang login
 * @access  Private (Author/Admin)
 */
const getMyQuizzes = async (req, res) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      where: { authorId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { questions: true, attempts: true } }
      }
    });
    res.status(200).json({ success: true, data: quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data', error: error.message });
  }
};

/**
 * @route   PUT /api/quizzes/:id
 * @desc    Mengupdate informasi dan pengaturan kuis
 * @access  Private (Author/Admin)
 */
const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, description, timeLimit, status, pin,
      startDate, endDate, showScore, randomizeQuestions, maxAttempts 
    } = req.body;

    const existingQuiz = await prisma.quiz.findFirst({
      where: { id, authorId: req.user.id }
    });

    if (!existingQuiz) {
      return res.status(404).json({ success: false, message: 'Kuis tidak ditemukan atau Anda tidak memiliki akses.' });
    }

    const updatedQuiz = await prisma.quiz.update({
      where: { id },
      data: { 
        title, 
        description, 
        timeLimit: timeLimit ? parseInt(timeLimit) : null, 
        status, 
        pin: pin || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        showScore: showScore !== undefined ? Boolean(showScore) : undefined,
        randomizeQuestions: randomizeQuestions !== undefined ? Boolean(randomizeQuestions) : undefined,
        maxAttempts: maxAttempts ? parseInt(maxAttempts) : undefined,
      }
    });

    res.status(200).json({ success: true, message: 'Kuis berhasil diupdate', data: updatedQuiz });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal update kuis', error: error.message });
  }
};

/**
 * @route   DELETE /api/quizzes/:id
 * @desc    Menghapus kuis (Otomatis menghapus soal dan attempt terkait karena cascade)
 * @access  Private (Author/Admin)
 */
const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    const existingQuiz = await prisma.quiz.findFirst({
      where: { id, authorId: req.user.id }
    });

    if (!existingQuiz) {
      return res.status(404).json({ success: false, message: 'Kuis tidak ditemukan atau Anda tidak memiliki akses.' });
    }

    await prisma.quiz.delete({ where: { id } });

    res.status(200).json({ success: true, message: 'Kuis berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menghapus kuis', error: error.message });
  }
};


/**
 * @route   GET /api/quizzes/public
 * @desc    Mendapatkan daftar kuis publik (Status PUBLISHED dan tanpa PIN)
 * @access  Public (Siapa saja bisa melihat katalog kuis)
 */
const getPublicQuizzes = async (req, res) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      where: {
        status: 'PUBLISHED',
        pin: null 
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        timeLimit: true,
        createdAt: true,
        author: {
          select: { name: true }
        },
        _count: {
          select: { questions: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ success: true, data: quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil daftar kuis', error: error.message });
  }
};

/**
 * @route   GET /api/quizzes/join/:quizCode
 * @desc    Mendapatkan informasi detail kuis untuk halaman Lobby persiapan
 * @access  Private (Hanya user yang sudah login/Participant)
 */
const getQuizForLobby = async (req, res) => {
  try {
    const { quizCode } = req.params; 

    const quiz = await prisma.quiz.findUnique({
      where: { quizCode },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        timeLimit: true,
        status: true,
        pin: true,
        maxAttempts: true,
        author: { select: { name: true } },
        _count: { select: { questions: true } }
      }
    });

    if (!quiz || quiz.status !== 'PUBLISHED') {
      return res.status(404).json({ success: false, message: 'Kuis tidak ditemukan atau belum aktif.' });
    }

    const isPrivate = quiz.pin !== null;
    delete quiz.pin;

    res.status(200).json({ 
      success: true, 
      data: { ...quiz, isPrivate } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil detail kuis', error: error.message });
  }
};

module.exports = { 
  createQuiz, getMyQuizzes, updateQuiz, deleteQuiz, 
  getPublicQuizzes, getQuizForLobby 
};