const express = require('express');
// mergeParams allows us to access parameters from the parent router (e.g., :contactId)
const router = express.Router({ mergeParams: true }); 
const { getActivitiesForContact, createActivity } = require('../controllers/activityController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getActivitiesForContact)
  .post(createActivity);

module.exports = router;