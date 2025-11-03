const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  originalname: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  url: { type: String, required: true },
  public_id: { type: String, required: true },
  
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
}, { timestamps: true });

module.exports = mongoose.model('File', fileSchema);