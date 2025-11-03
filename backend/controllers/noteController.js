const Note = require('../models/Note');
const Contact = require('../models/Contact');

// @desc    Get all notes for a specific contact
// @route   GET /api/contacts/:contactId/notes
// @access  Private
const getNotesForContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.contactId);
    if (!contact || contact.ownerId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Contact not found or not authorized' });
    }

    const notes = await Note.find({ contactId: req.params.contactId }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a new note for a contact
// @route   POST /api/contacts/:contactId/notes
// @access  Private
const createNote = async (req, res) => {
  const { body, dealId } = req.body;
  const sender = req.user; // The user creating the note

  try {
    const contact = await Contact.findById(req.params.contactId);
    if (!contact || contact.ownerId.toString() !== sender.id) {
      return res.status(404).json({ message: 'Contact not found or not authorized' });
    }

    const note = new Note({
      body,
      dealId,
      userId: sender.id,
      contactId: req.params.contactId,
    });

    const createdNote = await note.save();

    // --- @Mention Logic ---
    // Use a regular expression to find all @mentions (e.g., @JohnDoe)
    const mentionRegex = /@(\w+)/g;
    const mentions = body.match(mentionRegex);

    if (mentions) {
      // Get a unique list of mentioned usernames (without the '@')
      const mentionedUsernames = [...new Set(mentions.map(m => m.substring(1)))];
      
      // Find all users who were mentioned
      const mentionedUsers = await User.find({ name: { $in: mentionedUsernames } });

      // Create a notification for each mentioned user
      for (const user of mentionedUsers) {
        // Don't send a notification to the person who wrote the note
        if (user._id.toString() !== sender.id.toString()) {
          await Notification.create({
            recipient: user._id,
            sender: sender.id,
            message: `${sender.name} mentioned you in a note on ${contact.firstName} ${contact.lastName}'s page.`,
            link: `/contacts/${contact._id}`,
          });
        }
      }
    }
    // --- End @Mention Logic ---

    res.status(201).json(createdNote);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { getNotesForContact, createNote };