// pollController.js
const Poll = require('../../schema/pollSchema');

// Create a new poll
exports.createPoll = async (req, res) => {
  try {
    const poll = new Poll(req.body);
    await poll.save();
    res.status(201).json(poll);
  } catch (err) {
    console.error("Error creating poll:", err);
    res.status(500).json({ error: "Failed to create poll" });
  }
};

// Get all polls
exports.getAllPolls = async (req, res) => {
  try {
    const polls = await Poll.find();
    res.status(200).json(polls);
  } catch (err) {
    console.error("Error fetching polls:", err);
    res.status(500).json({ error: "Failed to fetch polls" });
  }
};

// Get a poll by ID
exports.getPollById = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({ error: "Poll not found" });
    }
    res.status(200).json(poll);
  } catch (err) {
    console.error("Error fetching poll:", err);
    res.status(500).json({ error: "Failed to fetch poll" });
  }
};

// Update a poll by ID
exports.updatePoll = async (req, res) => {
  try {
    const poll = await Poll.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!poll) {
      return res.status(404).json({ error: "Poll not found" });
    }
    res.status(200).json(poll);
  } catch (err) {
    console.error("Error updating poll:", err);
    res.status(500).json({ error: "Failed to update poll" });
  }
};

// Delete a poll by ID
exports.deletePoll = async (req, res) => {
  try {
    const poll = await Poll.findByIdAndDelete(req.params.id);
    if (!poll) {
      return res.status(404).json({ error: "Poll not found" });
    }
    res.status(200).json({ message: "Poll deleted successfully" });
  } catch (err) {
    console.error("Error deleting poll:", err);
    res.status(500).json({ error: "Failed to delete poll" });
  }
};
