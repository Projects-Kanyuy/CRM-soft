const express = require('express');
const router = express.Router();
const {
  getContacts,
  createContact,
  getContactById,
  updateContact,
  deleteContact,
  importContacts,
} = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');
const { uploadCsv } = require('../middleware/uploadMiddleware');

// Apply the 'protect' middleware to all routes in this file
router.use(protect);
router.route('/import').post(uploadCsv, importContacts);


// Routes for getting all contacts and creating a new one
router.route('/')
  .get(getContacts)
  .post(createContact);

// Routes for getting, updating, and deleting a single contact by its ID
router.route('/:id')
  .get(getContactById)
  .put(updateContact)
  .delete(deleteContact);

module.exports = router;