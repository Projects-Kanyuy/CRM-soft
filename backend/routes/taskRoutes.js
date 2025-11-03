const express = require('express');
const router = express.Router();
const { getUserTasks, updateTaskStatus } = require('../controllers/activityController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getUserTasks);

router.route('/:id')
  .put(updateTaskStatus);

module.exports = router;