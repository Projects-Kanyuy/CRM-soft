const express = require('express');
const router = express.Router({ mergeParams: true });
const { getContactFiles, uploadContactFile, deleteContactFile } = require('../controllers/fileController');
const { protect } = require('../middleware/authMiddleware');
const { uploadFile: uploadFileMiddleware } = require('../middleware/uploadMiddleware');

router.use(protect);

router.route('/')
  .get(getContactFiles)
  .post(uploadFileMiddleware, uploadContactFile);

router.route('/:fileId')
  .delete(deleteContactFile);

module.exports = router;