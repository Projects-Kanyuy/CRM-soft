const express = require('express');
const router = express.Router();
const { 
    getOrganizations, createOrganization, getOrganizationById, deleteOrganization, updateOrganization,
    uploadLogo, uploadPictures, deletePicture, uploadVideos, deleteVideo
} = require('../controllers/organizationController');
const { protect, admin } = require('../middleware/authMiddleware');
const { uploadLogo: uploadLogoMiddleware, uploadPictures: uploadPicturesMiddleware, uploadVideos: uploadVideosMiddleware } = require('../middleware/uploadMiddleware');

router.use(protect);

router.route('/')
  .get(getOrganizations)
  .post(createOrganization);

router.route('/:id')
  .get(getOrganizationById)
  .put(updateOrganization)
  .delete(deleteOrganization);

// Asset Routes
router.route('/:id/logo').post(uploadLogoMiddleware, uploadLogo);
router.route('/:id/pictures').post(uploadPicturesMiddleware, uploadPictures);
router.route('/:id/pictures/:public_id').delete(deletePicture);
router.route('/:id/videos').post(uploadVideosMiddleware, uploadVideos);
router.route('/:id/videos/:public_id').delete(deleteVideo);

module.exports = router;