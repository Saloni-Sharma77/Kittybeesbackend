const TheamePoll = require('../../schema/theamPollSchema');

// Create a new poll
exports.createPoll = async (req, res) => {
  try {
    const poll = new TheamePoll(req.body);
    await poll.save();
    res.status(201).json(poll);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all polls
exports.getAllPolls = async (req, res) => {
  try {
    const polls = await TheamePoll.find();
    res.status(200).json(polls);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a specific poll by ID
exports.getPollById = async (req, res) => {
  try {
    const poll = await TheamePoll.findById(req.params.id);
    if (!poll) return res.status(404).json({ message: 'Poll not found' });
    res.status(200).json(poll);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a poll by ID
exports.updatePoll = async (req, res) => {
  try {
    const poll = await TheamePoll.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!poll) return res.status(404).json({ message: 'Poll not found' });
    res.status(200).json(poll);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a poll by ID
exports.deletePoll = async (req, res) => {
  try {
    const poll = await TheamePoll.findByIdAndDelete(req.params.id);
    if (!poll) return res.status(404).json({ message: 'Poll not found' });
    res.status(200).json({ message: 'Poll deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
