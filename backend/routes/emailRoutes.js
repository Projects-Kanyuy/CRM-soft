const express = require('express');
const router = express.Router({ mergeParams: true });
const { sendContactEmail } = require('../controllers/emailController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .post(sendContactEmail);

module.exports = router;