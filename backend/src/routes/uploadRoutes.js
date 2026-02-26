const express = require('express');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const createUploader = require('../middlewares/uploadLocal');

const router = express.Router();

router.use(authenticate);
router.use(authorize('AUTHOR', 'ADMIN'));

router.post('/question', createUploader('questions').single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'File gambar tidak ditemukan.' });
  }
  res.status(200).json({ success: true, imageUrl: `/uploads/questions/${req.file.filename}` });
});

router.post('/option', createUploader('options').single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'File gambar tidak ditemukan.' });
  }
  res.status(200).json({ success: true, imageUrl: `/uploads/options/${req.file.filename}` });
});

module.exports = router;