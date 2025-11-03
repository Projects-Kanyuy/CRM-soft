const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  title: { type: String, required: true },
  value: { type: Number, required: true },
  stage: {
    type: String,
    enum: ['Lead', 'Qualification', 'Proposal', 'Won', 'Lost'],
    default: 'Lead',
    required: true,
  },
  contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact', required: true },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  closeDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Deal', dealSchema);