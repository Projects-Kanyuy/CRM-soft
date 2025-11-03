const express = require('express');
const router = express.Router({ mergeParams: true });
const { getOrganizationFiles, uploadOrganizationFile, deleteOrganizationFile } = require('../controllers/fileController');
const { protect } = require('../middleware/authMiddleware');
const { uploadFile: uploadFileMiddleware } = require('../middleware/uploadMiddleware');

router.use(protect);

router.route('/')
  .get(getOrganizationFiles)
  .post(uploadFileMiddleware, uploadOrganizationFile);

router.route('/:fileId')
  .delete(deleteOrganizationFile);

module.exports = router;