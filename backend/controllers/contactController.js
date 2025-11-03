const Contact = require('../models/Contact');
const csv = require('csv-parser');
const { Readable } = require('stream');
const asyncHandler = require('express-async-handler');

// @desc    Get all contacts for the logged-in user, with filtering
// @route   GET /api/contacts
// @access  Private
const getContacts = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.user.role !== 'Admin') {
    filter.ownerId = req.user.id;
  }
  if (req.query.organization) {
    filter.organizationId = req.query.organization;
  }
  
  // <-- IMPROVEMENT: Populate the fields to get the user's name
  const contacts = await Contact.find(filter)
    .populate('organizationId', 'name')
    .populate('createdBy', 'name')
    .populate('lastModifiedBy', 'name');
    
  res.status(200).json(contacts);
});

// @desc    Create a new contact
// @route   POST /api/contacts
// @access  Private
const createContact = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, organizationId } = req.body;
  if (!firstName || !lastName || !email) {
    res.status(400);
    throw new Error('Please provide first name, last name, and email');
  }
  const contact = new Contact({
    firstName,
    lastName,
    email,
    phone,
    organizationId,
    ownerId: req.user.id,
    createdBy: req.user.id,
    lastModifiedBy: req.user.id,
  });
  const createdContact = await contact.save();
  res.status(201).json(createdContact);
});

// @desc    Get a single contact by ID
// @route   GET /api/contacts/:id
// @access  Private
const getContactById = asyncHandler(async (req, res) => {
  // <-- IMPROVEMENT: Populate fields for the detail view
  const contact = await Contact.findById(req.params.id)
    .populate('organizationId', 'name')
    .populate('createdBy', 'name')
    .populate('lastModifiedBy', 'name');

  if (!contact) {
    res.status(404);
    throw new Error('Contact not found');
  }
  if (contact.ownerId.toString() !== req.user.id && req.user.role !== 'Admin') {
    res.status(401);
    throw new Error('Not authorized to access this contact');
  }
  res.status(200).json(contact);
});

// @desc    Update a contact
// @route   PUT /api/contacts/:id
// @access  Private
const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error('Contact not found');
  }
  if (contact.ownerId.toString() !== req.user.id && req.user.role !== 'Admin') {
    res.status(401);
    throw new Error('Not authorized to update this contact');
  }
  
  // <-- FIX: Correctly structure the data to be updated
  const dataToUpdate = {
    ...req.body,
    lastModifiedBy: req.user.id, // Set the last modified user
  };

  // <-- FIX: Use the correct arguments for findByIdAndUpdate
  const updatedContact = await Contact.findByIdAndUpdate(req.params.id, dataToUpdate, { new: true });
  
  res.status(200).json(updatedContact);
});

// @desc    Delete a contact
// @route   DELETE /api/contacts/:id
// @access  Private
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error('Contact not found');
  }
  if (contact.ownerId.toString() !== req.user.id && req.user.role !== 'Admin') {
    res.status(401);
    throw new Error('Not authorized to delete this contact');
  }
  await contact.deleteOne();
  res.status(200).json({ id: req.params.id, message: 'Contact removed' });
});

// @desc    Import contacts from a CSV file
// @route   POST /api/contacts/import
// @access  Private
const importContacts = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a CSV file.');
  }

  const results = [];
  const stream = Readable.from(req.file.buffer.toString());

  stream
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      let createdCount = 0;
      let errorCount = 0;
      const errors = [];
      for (const contactData of results) {
        if (!contactData.firstName || !contactData.lastName || !contactData.email) {
          errorCount++;
          errors.push(`Skipped row due to missing required fields: ${JSON.stringify(contactData)}`);
          continue;
        }
        try {
          const existingContact = await Contact.findOne({ email: contactData.email, ownerId: req.user.id });
          if (!existingContact) {
            // <-- FIX: Add createdBy and lastModifiedBy to imported contacts
            await Contact.create({ 
              ...contactData, 
              ownerId: req.user.id,
              createdBy: req.user.id,
              lastModifiedBy: req.user.id
            });
            createdCount++;
          } else {
            errorCount++;
            errors.push(`Skipped duplicate email: ${contactData.email}`);
          }
        } catch (error) {
          errorCount++;
          errors.push(`Error importing ${contactData.email}: ${error.message}`);
        }
      }
      res.status(201).json({ message: 'Import process completed.', created: createdCount, errors: errorCount, errorDetails: errors });
    });
});

module.exports = {
  getContacts,
  createContact,
  getContactById,
  updateContact,
  deleteContact,
  importContacts,
};