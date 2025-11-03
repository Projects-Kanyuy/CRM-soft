const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  body: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
  dealId: { type: mongoose.Schema.Types.ObjectId, ref: 'Deal' },
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);