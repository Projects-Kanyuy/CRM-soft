const sendEmail = require('../config/email');
const Contact = require('../models/Contact');
const Activity = require('../models/Activity');
const asyncHandler = require('express-async-handler');

// @desc    Send an email to a contact and log it
// @route   POST /api/contacts/:contactId/email
// @access  Private
const sendContactEmail = asyncHandler(async (req, res) => {
  const { subject, body } = req.body;
  const contactId = req.params.contactId;
  const user = req.user;

  if (!subject || !body) {
    res.status(400);
    throw new Error('Subject and body are required.');
  }

  const contact = await Contact.findById(contactId);
  if (!contact || (contact.ownerId.toString() !== user.id && user.role !== 'Admin')) {
    res.status(404);
    throw new Error('Contact not found or not authorized.');
  }

  // 1. Send the email
  await sendEmail({
    to: contact.email,
    subject: subject,
    html: body, // We'll send HTML from our rich text editor
  });

  // 2. Log the email as an activity
  await Activity.create({
    kind: 'Email',
    subject: `Email: ${subject}`,
    body: body, // Storing the HTML body in the activity log
    scheduledAt: new Date(), // Logged at the time it was sent
    status: 'Completed',
    userId: user.id,
    contactId: contact._id,
  });

  res.status(200).json({ message: 'Email sent and logged successfully.' });
});

module.exports = { sendContactEmail };