const router = require('express').Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } });

router.post('/image', auth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

router.post('/audio', auth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

module.exports = router;
