const Organization = require('../models/Organization');
const asyncHandler = require('express-async-handler'); // <-- Import asyncHandler
const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

const streamUpload = (buffer, options) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
            if (result) { resolve(result); } 
            else { reject(error); }
        });
        streamifier.createReadStream(buffer).pipe(stream);
    });
};
// @desc    Get all organizations
// @route   GET /api/organizations
// @access  Private
const getOrganizations = asyncHandler(async (req, res) => {
  // The try/catch block is no longer needed because asyncHandler handles it.
  const organizations = await Organization.find().sort({ name: 1 })
   .populate('createdBy', 'name')
    .populate('lastModifiedBy', 'name');
  res.status(200).json(organizations);
});

// @desc    Create a new organization
// @route   POST /api/organizations
// @access  Private
const createOrganization = asyncHandler(async (req, res) => {
  const { name, website, industry, size } = req.body;
  if (!name) {
    res.status(400);
    throw new Error('Organization name is required');
  }
  const organization = new Organization({ name, website, industry, size });
  organization.createdBy = req.user.id;
  organization.lastModifiedBy = req.user.id;
  const createdOrganization = await organization.save();
  res.status(201).json(createdOrganization);
});

// @desc    Get a single organization by ID
// @route   GET /api/organizations/:id
// @access  Private
const getOrganizationById = asyncHandler(async (req, res) => {
  const organization = await Organization.findById(req.params.id);
  if (!organization) {
    res.status(404);
    throw new Error('Organization not found');
  }
  res.status(200).json(organization);
});

// @desc    Update an organization
// @route   PUT /api/organizations/:id
// @access  Private
const updateOrganization = asyncHandler(async (req, res) => {
  const organization = await Organization.findById(req.params.id);
  if (!organization) { res.status(404); throw new Error('Organization not found'); }

  // Special handling for services if it's a comma-separated string
  let servicesArray = req.body.services;
  if (typeof servicesArray === 'string') {
    servicesArray = servicesArray.split(',').map(s => s.trim()).filter(s => s);
  }

  const dataToUpdate = {
    ...req.body,
    services: servicesArray, // Use the processed array
    lastModifiedBy: req.user.id,
  };

  const updatedOrganization = await Organization.findByIdAndUpdate(req.params.id, dataToUpdate, { new: true });
  res.status(200).json(updatedOrganization);
});
// @desc    Delete an organization
// @route   DELETE /api/organizations/:id
// @access  Private
const deleteOrganization = asyncHandler(async (req, res) => {
  const organization = await Organization.findById(req.params.id);
  if (!organization) {
    res.status(404);
    throw new Error('Organization not found');
  }
  await organization.deleteOne();
  res.status(200).json({ id: req.params.id, message: 'Organization removed' });
});

const uploadLogo = asyncHandler(async (req, res) => {
  const organization = await Organization.findById(req.params.id);
  if (!organization) { res.status(404); throw new Error('Organization not found'); }
  if (!req.file) { res.status(400); throw new Error('Please upload an image file.'); }

  if (organization.logoPublicId) {
    await cloudinary.uploader.destroy(organization.logoPublicId);
  }

  const result = await streamUpload(req.file.buffer, { folder: `crm/organizations/${organization._id}/logos` });
  
  organization.logoUrl = result.secure_url;
  organization.logoPublicId = result.public_id;
  organization.lastModifiedBy = req.user.id;
  await organization.save();
  res.status(200).json({ message: 'Logo uploaded', organization });
});

const uploadPictures = asyncHandler(async (req, res) => {
  const organization = await Organization.findById(req.params.id);
  if (!organization) { res.status(404); throw new Error('Organization not found'); }
  if (!req.files || req.files.length === 0) { res.status(400); throw new Error('Please upload picture files.'); }

  const uploadPromises = req.files.map(file => 
    streamUpload(file.buffer, { folder: `crm/organizations/${organization._id}/pictures` })
  );

  const results = await Promise.all(uploadPromises);
  const newPictures = results.map(result => ({ url: result.secure_url, public_id: result.public_id }));

  organization.pictures.push(...newPictures);
  organization.lastModifiedBy = req.user.id;
  await organization.save();
  res.status(200).json({ message: 'Pictures uploaded', organization });
});

const deletePicture = asyncHandler(async (req, res) => {
    const { id, public_id } = req.params;
    const organization = await Organization.findById(id);
    if (!organization) { res.status(404); throw new Error('Organization not found'); }
    await cloudinary.uploader.destroy(public_id);
    organization.pictures = organization.pictures.filter(p => p.public_id !== public_id);
    await organization.save();
    res.status(200).json({ message: 'Picture deleted', organization });
});

const uploadVideos = asyncHandler(async (req, res) => {
  const organization = await Organization.findById(req.params.id);
  if (!organization) { res.status(404); throw new Error('Organization not found'); }
  if (!req.files || req.files.length === 0) { res.status(400); throw new Error('Please upload video files.'); }

  const uploadPromises = req.files.map(file => 
    streamUpload(file.buffer, { resource_type: "video", folder: `crm/organizations/${organization._id}/videos` })
  );

  const results = await Promise.all(uploadPromises);
  const newVideos = results.map(result => ({ url: result.secure_url, public_id: result.public_id }));

  organization.videos.push(...newVideos);
  organization.lastModifiedBy = req.user.id;
  await organization.save();
  res.status(200).json({ message: 'Videos uploaded', organization });
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { id, public_id } = req.params;
    const organization = await Organization.findById(id);
    if (!organization) { res.status(404); throw new Error('Organization not found'); }
    await cloudinary.uploader.destroy(public_id, { resource_type: 'video' });
    organization.videos = organization.videos.filter(v => v.public_id !== public_id);
    await organization.save();
    res.status(200).json({ message: 'Video deleted', organization });
});

module.exports = {
  getOrganizations,
  createOrganization,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
  uploadLogo,
  uploadPictures,
  deletePicture,
  uploadVideos,
  deleteVideo,
};