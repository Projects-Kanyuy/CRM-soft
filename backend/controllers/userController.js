const User = require('../models/User');
const bcrypt = require('bcrypt'); // <-- Import bcrypt
const asyncHandler = require('express-async-handler'); // <-- Import asyncHandler

// @desc    Get all users
// @route   GET /api/users
// @access  Private
const getUsers = asyncHandler(async (req, res) => {
  if (req.user.role === 'Admin') {
    const users = await User.find().select('-passwordHash');
    res.status(200).json(users);
  } else {
    const users = await User.find().select('name _id');
    res.status(200).json(users);
  }
});

// @desc    Update a user's role by Admin
// @route   PUT /api/users/:id/role
// @access  Private (Admin)
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404); throw new Error('User not found');
  }
  user.role = role;
  await user.save();
  res.status(200).json({ _id: user._id, name: user.name, email: user.email, role: user.role });
});

// --- NEW FUNCTION ---
// @desc    Update logged-in user's profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (user) {
        user.name = req.body.name || user.name;
        // You could add more updatable fields here later
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// --- NEW FUNCTION ---
// @desc    Change logged-in user's password
// @route   PUT /api/users/profile/password
// @access  Private
const changeUserPassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        res.status(400);
        throw new Error('Please provide both current and new passwords.');
    }

    // We must fetch the user without .select('-passwordHash') to get the hash
    const user = await User.findById(req.user.id);
    
    if (user && (await bcrypt.compare(currentPassword, user.passwordHash))) {
        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(newPassword, salt);
        await user.save();
        res.json({ message: 'Password updated successfully.' });
    } else {
        res.status(401);
        throw new Error('Invalid current password.');
    }
});
const createUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
        res.status(400); throw new Error('Please provide all fields');
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400); throw new Error('User with this email already exists');
    }
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, passwordHash, role });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role, isActive: user.isActive });
});

const setUserStatus = asyncHandler(async (req, res) => {
    const { isActive } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404); throw new Error('User not found');
    }
    user.isActive = isActive;
    await user.save();
    res.status(200).json({ _id: user._id, name: user.name, email: user.email, role: user.role, isActive: user.isActive });
});
module.exports = { getUsers, updateUserRole, updateUserProfile, changeUserPassword, createUser, setUserStatus };