const Notification = require('../models/Notification');

// @desc    Get all notifications for the logged-in user
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort({ createdAt: -1 }) // Newest first
      .limit(20); // Limit to the most recent 20
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Mark notifications as read
// @route   POST /api/notifications/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    // This will mark all of the user's notifications as read.
    // A more advanced version might take an array of notification IDs in the body.
    await Notification.updateMany(
      { recipient: req.user.id, read: false },
      { $set: { read: true } }
    );
    res.status(200).json({ message: 'Notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getNotifications, markAsRead };