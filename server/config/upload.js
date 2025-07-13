// middlewares/upload.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = './uploads/';
    fs.mkdirSync(uploadPath, { recursive: true }); // Ensure folder exists
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file format. Only JPEG, JPG, PNG, GIF, and PDF are allowed.'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 4 * 1024 * 1024 }, // 3MB limit
  fileFilter,
}).fields([
  { name: 'images', maxCount: 6 }, // Up to 6 images
  { name: 'pdf', maxCount: 1 },    // 1 PDF
]);

export default upload;