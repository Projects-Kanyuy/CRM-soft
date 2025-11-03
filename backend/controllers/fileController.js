const File = require('../models/File');
const Contact = require('../models/Contact');
const Organization = require('../models/Organization'); // <-- Import Organization
const fs = require('fs');
const asyncHandler = require('express-async-handler');

const streamUpload = (buffer, options) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
            if (result) { resolve(result); } 
            else { reject(error); }
        });
        streamifier.createReadStream(buffer).pipe(stream);
    });
};
// Helper to check ownership of the parent document (Contact or Org)
const checkParentOwnership = async (parentType, parentId, userId) => {
  let parentDoc;
  if (parentType === 'contacts') {
    parentDoc = await Contact.findById(parentId);
    // Contacts have a direct ownerId
    return parentDoc && parentDoc.ownerId.toString() === userId;
  }
  if (parentType === 'organizations') {
    parentDoc = await Organization.findById(parentId);
    // Orgs are public for now, but we can add ownership checks here later
    return !!parentDoc; 
  }
  return false;
};

const getContactFiles = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.contactId);
  if (!contact || (contact.ownerId.toString() !== req.user.id && req.user.role !== 'Admin')) {
    res.status(404); throw new Error('Contact not found or not authorized');
  }
  const files = await File.find({ contactId: req.params.contactId }).sort({ createdAt: -1 });
  res.status(200).json(files);
});

const uploadContactFile = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.contactId);
  if (!contact || (contact.ownerId.toString() !== req.user.id && req.user.role !== 'Admin')) {
    res.status(404); throw new Error('Contact not found or not authorized');
  }
  if (!req.file) { res.status(400); throw new Error('Please upload a file'); }

  const result = await streamUpload(req.file.buffer, { folder: `crm/contacts/${req.params.contactId}/attachments`, resource_type: "auto" });

  const newFile = new File({
    originalname: req.file.originalname, mimetype: req.file.mimetype, size: req.file.size, url: result.secure_url, public_id: result.public_id,
    userId: req.user.id, contactId: req.params.contactId,
  });
  await newFile.save();
  res.status(201).json(newFile);
});

const deleteContactFile = asyncHandler(async (req, res) => {
    const file = await File.findById(req.params.fileId);
    if (!file || file.contactId.toString() !== req.params.contactId) { res.status(404); throw new Error('File not found in this contact'); }
    if (file.userId.toString() !== req.user.id && req.user.role !== 'Admin') { res.status(403); throw new Error('Not authorized'); }
    
    await cloudinary.uploader.destroy(file.public_id, { resource_type: file.mimetype.startsWith('video') ? 'video' : 'image' });
    await file.deleteOne();
    res.status(200).json({ message: 'File deleted', id: file._id });
});

// --- ORGANIZATION-SPECIFIC FILE FUNCTIONS ---

const getOrganizationFiles = asyncHandler(async (req, res) => {
  const organization = await Organization.findById(req.params.orgId);
  if (!organization) { res.status(404); throw new Error('Organization not found'); }
  const files = await File.find({ organizationId: req.params.orgId }).sort({ createdAt: -1 });
  res.status(200).json(files);
});

const uploadOrganizationFile = asyncHandler(async (req, res) => {
  const organization = await Organization.findById(req.params.orgId);
  if (!organization) { res.status(404); throw new Error('Organization not found'); }
  if (!req.file) { res.status(400); throw new Error('Please upload a file'); }

  const result = await streamUpload(req.file.buffer, { folder: `crm/organizations/${req.params.orgId}/attachments`, resource_type: "auto" });

  const newFile = new File({
    originalname: req.file.originalname, mimetype: req.file.mimetype, size: req.file.size, url: result.secure_url, public_id: result.public_id,
    userId: req.user.id, organizationId: req.params.orgId,
  });
  await newFile.save();
  res.status(201).json(newFile);
});

const deleteOrganizationFile = asyncHandler(async (req, res) => {
    const file = await File.findById(req.params.fileId);
    if (!file || file.organizationId.toString() !== req.params.orgId) { res.status(404); throw new Error('File not found in this organization'); }
    if (file.userId.toString() !== req.user.id && req.user.role !== 'Admin') { res.status(403); throw new Error('Not authorized'); }

    await cloudinary.uploader.destroy(file.public_id, { resource_type: file.mimetype.startsWith('video') ? 'video' : 'image' });
    await file.deleteOne();
    res.status(200).json({ message: 'File deleted', id: file._id });
});

module.exports = { 
    getContactFiles, uploadContactFile, deleteContactFile,
    getOrganizationFiles, uploadOrganizationFile, deleteOrganizationFile
};