const multer = require('multer');
const path = require('path');

// --- Use Memory Storage for ALL file uploads intended for Cloudinary ---
const memoryStorage = multer.memoryStorage();

// --- Helper Functions ---
function checkFileType(file, cb, filetypes) {
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Invalid file type!');
  }
}

// --- Specific Configurations (all now use memoryStorage) ---
const uploadLogo = multer({
  storage: memoryStorage,
  limits: { fileSize: 2000000 }, // 2MB
  fileFilter: (req, file, cb) => checkFileType(file, cb, /jpeg|jpg|png|gif|webp/),
}).single('logo');

const uploadPictures = multer({
  storage: memoryStorage,
  limits: { fileSize: 10000000 }, // 10MB
  fileFilter: (req, file, cb) => checkFileType(file, cb, /jpeg|jpg|png|gif|webp/),
}).array('pictures', 10);

const uploadVideos = multer({
  storage: memoryStorage,
  limits: { fileSize: 50000000 }, // 50MB
  fileFilter: (req, file, cb) => checkFileType(file, cb, /mp4|mov|avi|wmv/),
}).array('videos', 5);

const uploadFile = multer({
  storage: memoryStorage,
  limits: { fileSize: 20000000 }, // 20MB for generic attachments
}).single('file');

const uploadCsv = multer({
  storage: memoryStorage,
  fileFilter: (req, file, cb) => {
    const filetypes = /csv/;
    const mimetype = file.mimetype === 'text/csv' || file.mimetype === 'application/vnd.ms-excel';
    if (mimetype && filetypes.test(path.extname(file.originalname).toLowerCase())) {
        return cb(null, true);
    } else {
        cb('Error: Please upload a CSV file.');
    }
  }
}).single('file');

module.exports = { uploadLogo, uploadPictures, uploadVideos, uploadFile, uploadCsv };