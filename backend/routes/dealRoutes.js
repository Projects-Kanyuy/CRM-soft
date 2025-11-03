const express = require('express');
const router = express.Router();
const {
  getDeals,
  createDeal,
  getDealById,
  updateDeal,
  deleteDeal,
} = require('../controllers/dealController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getDeals)
  .post(createDeal);

router.route('/:id')
  .get(getDealById)
  .put(updateDeal)
  .delete(deleteDeal);

module.exports = router;