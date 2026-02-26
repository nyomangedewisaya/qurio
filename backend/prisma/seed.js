const prisma = require('../src/config/database');
const bcrypt = require('bcrypt');

async function main() {
  console.log('🌱 Memulai proses seeding database...');

  console.log('🧹 Membersihkan data lama...');
  await prisma.answer.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.option.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.user.deleteMany();

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);

  console.log('👤 Membuat data Users...');
  
  await prisma.user.create({
    data: { name: 'Super Admin', username: 'admin', password: hashedPassword, role: 'ADMIN' }
  });

  const author = await prisma.user.create({
    data: { name: 'Budi Instruktur', username: 'budi_guru', password: hashedPassword, role: 'AUTHOR', phone: '081234567890' }
  });

  const participant1 = await prisma.user.create({
    data: { name: 'Siswa Satu', username: 'siswa1', password: hashedPassword, role: 'PARTICIPANT' }
  });

  await prisma.user.create({
    data: { name: 'Siswa Dua', username: 'siswa2', password: hashedPassword, role: 'PARTICIPANT' }
  });

  console.log('📝 Membuat Kuis Publik...');
  const mathQuiz = await prisma.quiz.create({
    data: {
      title: 'Matematika Dasar 101',
      slug: 'matematika-dasar-101',
      description: 'Kuis sederhana untuk menguji kemampuan matematika dasar Anda.',
      quizCode: 'MATH-101',
      status: 'PUBLISHED',
      timeLimit: 15, 
      maxAttempts: 2,
      authorId: author.id,
    }
  });

  console.log('❓ Membuat Soal dan Pilihan Ganda...');
  const mathQ1 = await prisma.question.create({
    data: {
      quizId: mathQuiz.id,
      type: 'MC_EASY',
      content: 'Berapakah hasil dari 5 + 7?',
      options: {
        create: [
          { content: '10', isCorrect: false },
          { content: '12', isCorrect: true },
          { content: '14', isCorrect: false },
        ]
      }
    },
    include: { options: true }
  });

  const mathQ2 = await prisma.question.create({
    data: {
      quizId: mathQuiz.id,
      type: 'TRUE_FALSE',
      content: 'Ibukota negara Indonesia adalah Jakarta.',
      options: {
        create: [
          { content: 'Benar', isCorrect: true },
          { content: 'Salah', isCorrect: false },
        ]
      }
    },
    include: { options: true }
  });

  console.log('🎯 Membuat riwayat pengerjaan (Peserta menjawab)...');
  
  const mathQ1CorrectOption = mathQ1.options.find(opt => opt.isCorrect).id;
  const mathQ2WrongOption = mathQ2.options.find(opt => !opt.isCorrect).id;

  await prisma.quizAttempt.create({
    data: {
      quizId: mathQuiz.id,
      participantId: participant1.id,
      score: 50.0,
      startedAt: new Date(Date.now() - 1000 * 60 * 10), 
      completedAt: new Date(),
      answers: {
        create: [
          { questionId: mathQ1.id, optionId: mathQ1CorrectOption, isCorrect: true },
          { questionId: mathQ2.id, optionId: mathQ2WrongOption, isCorrect: false }
        ]
      }
    }
  });

  console.log('✅ Seeding database selesai tanpa error!');
  console.log('--------------------------------------------------');
  console.log('Gunakan akun berikut untuk login saat testing di Frontend:');
  console.log('1. Admin       -> username: admin       | pass: password123');
  console.log('2. Pembuat Soal-> username: budi_guru   | pass: password123');
  console.log('3. Penjawab    -> username: siswa1      | pass: password123');
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('❌ Terjadi error saat seeding:', e);
    process.exit(1);
  });