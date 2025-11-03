const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  kind: { type: String, enum: ['Call', 'Meeting', 'Task', 'Email'], required: true },
  subject: { type: String, required: true },
  body: { type: String },
  scheduledAt: { type: Date }, // No longer required, as Tasks will use dueDate
  
  // New fields for Task Management
  dueDate: { type: Date },
  status: { 
    type: String, 
    enum: ['Pending', 'Completed'], 
    default: 'Pending' 
  },

  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
  dealId: { type: mongoose.Schema.Types.ObjectId, ref: 'Deal' },
}, { timestamps: true });

// A virtual property to get the relevant date for sorting
activitySchema.virtual('effectiveDate').get(function() {
  return this.dueDate || this.scheduledAt;
});

module.exports = mongoose.model('Activity', activitySchema);