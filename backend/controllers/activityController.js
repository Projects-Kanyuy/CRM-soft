const Activity = require('../models/Activity');
const Contact = require('../models/Contact');

// @desc    Get all activities for a specific contact
// @route   GET /api/contacts/:contactId/activities
// @access  Private
const getActivitiesForContact = async (req, res) => {
  try {
    // Verify the parent contact belongs to the user
    const contact = await Contact.findById(req.params.contactId);
    if (!contact || contact.ownerId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Contact not found or not authorized' });
    }
    
    const activities = await Activity.find({ contactId: req.params.contactId }).sort({ scheduledAt: -1 });
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a new activity for a contact
// @route   POST /api/contacts/:contactId/activities
// @access  Private
const createActivity = async (req, res) => {
  const { kind, subject, body, scheduledAt, dealId } = req.body;

  try {
    const contact = await Contact.findById(req.params.contactId);
    if (!contact || contact.ownerId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Contact not found or not authorized' });
    }

    const activity = new Activity({
      kind,
      subject,
      body,
      scheduledAt,
      dealId,
      userId: req.user.id,
      contactId: req.params.contactId,
    });

    const createdActivity = await activity.save();
    res.status(201).json(createdActivity);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
// @route   GET /api/tasks
// @access  Private
const getUserTasks = async (req, res) => {
  try {
    const tasks = await Activity.find({ 
      userId: req.user.id,
      kind: 'Task' 
    })
    .populate('contactId', 'firstName lastName')
    .sort({ dueDate: 1 }); // Sort by due date, upcoming first

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update a task's status
// @route   PUT /api/tasks/:id
// @access  Private
const updateTaskStatus = async (req, res) => {
  const { status } = req.body;
  
  try {
    let task = await Activity.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    // Security check
    if (task.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    // Ensure it's a task
    if (task.kind !== 'Task') {
        return res.status(400).json({ message: 'This activity is not a task' });
    }

    task.status = status;
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


module.exports = { getActivitiesForContact, createActivity, getUserTasks, updateTaskStatus };