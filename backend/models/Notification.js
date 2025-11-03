const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  // The user who will receive the notification
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // The user who triggered the notification (optional, e.g., for @mentions)
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // The message to be displayed
  message: { type: String, required: true },
  
  // A link to the relevant item (e.g., /contacts/:id)
  link: { type: String },
  
  // Read status
  read: { type: Boolean, default: false },

}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);