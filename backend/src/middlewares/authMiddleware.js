const jwt = require('jsonwebtoken');
const prisma = require('../config/database');

const authenticate = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Akses ditolak. Token tidak ditemukan.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, username: true, role: true, phone: true }
    });

    if (!currentUser) {
      return res.status(401).json({ success: false, message: 'User dari token ini sudah tidak ada.' });
    }

    req.user = currentUser;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token tidak valid atau sudah kedaluwarsa.' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Akses terlarang. Anda tidak memiliki izin untuk tindakan ini.' 
      });
    }
    next();
  };
};

module.exports = { authenticate, authorize };