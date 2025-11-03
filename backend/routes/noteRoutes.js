const express = require('express');
const router = express.Router({ mergeParams: true });
const { getNotesForContact, createNote } = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getNotesForContact)
  .post(createNote);

module.exports = router;