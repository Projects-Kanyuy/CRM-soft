const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  kind: { type: String, enum: ['Call', 'Meeting', 'Task', 'Email'], required: true },
  subject: { type: String, required: true },
  body: { type: String },
  scheduledAt: { type: Date },
  dueDate: { type: Date },
  status: { 
    type: String, 
    enum: ['Pending', 'Completed'], 
    default: 'Pending' 
  },
  
  // --- NEW FIELD ---
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The creator
  contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
  dealId: { type: mongoose.Schema.Types.ObjectId, ref: 'Deal' },
}, { timestamps: true });

activitySchema.virtual('effectiveDate').get(function() {
  return this.dueDate || this.scheduledAt;
});

module.exports = mongoose.model('Activity', activitySchema);