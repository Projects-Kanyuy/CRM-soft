const Deal = require('../models/Deal');
const asyncHandler = require('express-async-handler');

// @desc    Get all deals for the user, with filtering
// @route   GET /api/deals
// @access  Private
const getDeals = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.user.role !== 'Admin') {
    filter.ownerId = req.user.id;
  }

  // --- NEW FILTER LOGIC ---
  // Check for an organization filter in the query string
  if (req.query.organization) {
    filter.organizationId = req.query.organization;
  }
  // --- END OF NEW LOGIC ---

  const deals = await Deal.find(filter)
    .populate('contactId', 'firstName lastName')
    .populate('organizationId', 'name');
  res.status(200).json(deals);
});
// @desc    Create a new deal
// @route   POST /api/deals
// @access  Private
const createDeal = asyncHandler(async (req, res) => {
  const { title, value, stage, contactId, organizationId, closeDate } = req.body;
  if (!title || !value || !contactId || !organizationId) {
    res.status(400);
    throw new Error('Title, value, contact, and organization are required');
  }
  const deal = new Deal({
    title, value, stage, contactId, organizationId, closeDate,
    ownerId: req.user.id,
  });
  const createdDeal = await deal.save();
  const populatedDeal = await Deal.findById(createdDeal._id)
    .populate('contactId', 'firstName lastName')
    .populate('organizationId', 'name');
  res.status(201).json(populatedDeal);
});

// @desc    Get a single deal by ID
// @route   GET /api/deals/:id
// @access  Private
const getDealById = asyncHandler(async (req, res) => {
  const deal = await Deal.findById(req.params.id);
  if (!deal) {
    res.status(404);
    throw new Error('Deal not found');
  }
  if (deal.ownerId.toString() !== req.user.id && req.user.role !== 'Admin') {
    res.status(401);
    throw new Error('Not authorized');
  }
  res.status(200).json(deal);
});

// @desc    Update a deal
// @route   PUT /api/deals/:id
// @access  Private
const updateDeal = asyncHandler(async (req, res) => {
  const deal = await Deal.findById(req.params.id);
  if (!deal) {
    res.status(404);
    throw new Error('Deal not found');
  }
  if (deal.ownerId.toString() !== req.user.id && req.user.role !== 'Admin') {
    res.status(401);
    throw new Error('Not authorized');
  }
  const updatedDeal = await Deal.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .populate('contactId', 'firstName lastName')
    .populate('organizationId', 'name');
  res.status(200).json(updatedDeal);
});

// @desc    Delete a deal
// @route   DELETE /api/deals/:id
// @access  Private
const deleteDeal = asyncHandler(async (req, res) => {
  const deal = await Deal.findById(req.params.id);
  if (!deal) {
    res.status(404);
    throw new Error('Deal not found');
  }
  if (deal.ownerId.toString() !== req.user.id && req.user.role !== 'Admin') {
    res.status(401);
    throw new Error('Not authorized');
  }
  await deal.deleteOne();
  res.status(200).json({ id: req.params.id, message: 'Deal removed' });
});

module.exports = {
  getDeals,
  createDeal,
  getDealById,
  updateDeal,
  deleteDeal,
};