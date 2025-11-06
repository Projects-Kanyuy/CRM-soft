const express = require('express');
const router = express.Router();
const { getUserTasks, updateTaskStatus, getAllTasks } = require('../controllers/activityController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);
router.route('/all').get(admin, getAllTasks);


router.route('/')
  .get(getUserTasks);

router.route('/:id')
  .put(updateTaskStatus);

module.exports = router;