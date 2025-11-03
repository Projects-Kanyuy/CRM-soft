const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  website: { type: String },
  industry: { type: String },
  size: { type: Number },
  biography: { type: String },
  services: [{ type: String }],
  
  logoUrl: { type: String },
  logoPublicId: { type: String },
  
  pictures: [{ 
    url: { type: String, required: true }, 
    public_id: { type: String, required: true } 
  }],
  
  videos: [{ 
    url: { type: String, required: true }, 
    public_id: { type: String, required: true } 
  }],

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Organization', organizationSchema);