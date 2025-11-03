const express = require('express');
const router = express.Router();
const {
  getOrganizations,
  createOrganization,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
  uploadLogo,
  uploadPictures,
  deletePicture,
  uploadVideos,
  deleteVideo
} = require('../controllers/organizationController');
const { protect } = require('../middleware/authMiddleware');
const { uploadLogo: uploadLogoMiddleware } = require('../middleware/uploadMiddleware'); 

// Protect all routes in this file
router.use(protect);

router.route('/')
  .get(getOrganizations)
  .post(createOrganization);

router.route('/:id')
  .get(getOrganizationById)
  .put(updateOrganization)
  .delete(deleteOrganization);
router.route('/:id/logo')
  .post(uploadLogoMiddleware, uploadLogo);
  router.route('/:id/logo').post(protect, uploadLogo, /* uploadLogoController */);
router.route('/:id/pictures').post(protect, uploadPictures, /* uploadPicturesController */);
router.route('/:id/pictures/:filename').delete(protect, deletePicture /* deletePictureController */);
router.route('/:id/videos').post(protect, uploadVideos, /* uploadVideosController */);
router.route('/:id/videos/:filename').delete(protect, deleteVideo /* deleteVideoController */);


module.exports = router;