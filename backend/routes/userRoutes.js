const express = require('express');
const router = express.Router();
const { getUsers, updateUserRole, updateUserProfile, changeUserPassword, createUser, setUserStatus } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getUsers);
router.route('/:id/role').put(admin, updateUserRole);
router.route('/profile')
  .put(updateUserProfile);

router.route('/profile/password')
  .put(changeUserPassword);
  router.route('/').get(getUsers).post(admin, createUser); 
router.route('/:id/status').put(admin, setUserStatus);

module.exports = router;