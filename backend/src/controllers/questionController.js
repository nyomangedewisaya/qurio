const prisma = require('../config/database');

/**
 * @route   POST /api/questions/:quizId
 * @desc    Buat soal baru beserta pilihan gandanya
 * @access  Private (Author/Admin)
 */
const createQuestion = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { type, content, imageUrl, options } = req.body;

    const quiz = await prisma.quiz.findFirst({
      where: { id: quizId, authorId: req.user.id }
    });

    if (!quiz) {
      return res.status(403).json({ success: false, message: 'Akses ditolak. Anda bukan pemilik kuis ini.' });
    }

    const question = await prisma.question.create({
      data: {
        quizId,
        type,
        content,
        imageUrl: imageUrl || null,
        options: options && options.length > 0 ? {
          create: options.map(opt => ({
            content: opt.content,
            imageUrl: opt.imageUrl || null,
            isCorrect: opt.isCorrect || false
          }))
        } : undefined
      },
      include: { options: true }
    });

    res.status(201).json({ success: true, message: 'Soal berhasil ditambahkan', data: question });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menambah soal', error: error.message });
  }
};

/**
 * @route   GET /api/questions/quiz/:quizId
 * @desc    Ambil semua soal dalam satu kuis (Author melihat kunci, Participant tidak)
 * @access  Private
 */
const getQuestionsByQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const isAuthor = req.user.role === 'AUTHOR' || req.user.role === 'ADMIN';

    const questions = await prisma.question.findMany({
      where: { quizId },
      include: {
        options: {
          select: {
            id: true,
            content: true,
            imageUrl: true,
            isCorrect: isAuthor 
          }
        }
      }
    });

    res.status(200).json({ success: true, data: questions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil soal', error: error.message });
  }
};

/**
 * @route   PUT /api/questions/:questionId
 * @desc    Mengupdate teks soal, gambar, dan pilihan gandanya
 * @access  Private (Author/Admin)
 */
const updateQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { type, content, imageUrl, options } = req.body;

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { quiz: true }
    });

    if (!question || (question.quiz.authorId !== req.user.id && req.user.role !== 'ADMIN')) {
      return res.status(403).json({ success: false, message: 'Akses ditolak.' });
    }

    const updatedQuestion = await prisma.$transaction(async (tx) => {
      
      if (options && options.length > 0) {
        await tx.option.deleteMany({ where: { questionId } });
      }

      return await tx.question.update({
        where: { id: questionId },
        data: {
          type,
          content,
          imageUrl,
          options: options && options.length > 0 ? {
            create: options.map(opt => ({
              content: opt.content,
              imageUrl: opt.imageUrl || null,
              isCorrect: opt.isCorrect || false
            }))
          } : undefined
        },
        include: { options: true }
      });
    });

    res.status(200).json({ success: true, message: 'Soal berhasil diperbarui', data: updatedQuestion });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui soal', error: error.message });
  }
};

/**
 * @route   DELETE /api/questions/:questionId
 * @desc    Hapus soal (Opsi otomatis terhapus karena onDelete: Cascade di Prisma)
 * @access  Private (Author/Admin)
 */
const deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { quiz: true }
    });

    if (!question || question.quiz.authorId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Akses ditolak.' });
    }

    await prisma.question.delete({ where: { id: questionId } });
    res.status(200).json({ success: true, message: 'Soal berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menghapus soal', error: error.message });
  }
};

module.exports = { createQuestion, getQuestionsByQuiz, updateQuestion, deleteQuestion };