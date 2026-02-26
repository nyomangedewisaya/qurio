const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};

/**
 * @route   POST /api/auth/register
 * @desc    Mendaftarkan user baru (Participant atau Author) beserta validasi phone
 * @access  Public
 */
const register = async (req, res) => {
  try {
    const { name, username, password, role, phone } = req.body;
    const assignedRole = role || 'PARTICIPANT';

    if (!name || !username || !password) {
      return res.status(400).json({ success: false, message: 'Nama, username, dan password wajib diisi.' });
    }

    if (assignedRole === 'AUTHOR' && !phone) {
      return res.status(400).json({ success: false, message: 'Nomor telepon wajib diisi untuk pendaftaran Author.' });
    }

    const userExists = await prisma.user.findUnique({ where: { username } });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Username sudah digunakan, silakan pilih yang lain.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        username,
        password: hashedPassword,
        role: assignedRole,
        phone: phone || null,
      },
      select: { id: true, name: true, username: true, role: true, phone: true, createdAt: true } 
    });

    res.status(201).json({ success: true, message: 'Registrasi berhasil', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server', error: error.message });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Autentikasi user & mendapatkan JWT Access Token
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username dan password wajib diisi.' });
    }

    const user = await prisma.user.findUnique({ where: { username } });
    
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user.id);
      const { password: _, ...userData } = user;

      res.status(200).json({
        success: true,
        message: 'Login berhasil',
        token,
        data: userData
      });
    } else {
      res.status(401).json({ success: false, message: 'Username atau password salah.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server', error: error.message });
  }
};

module.exports = { register, login };