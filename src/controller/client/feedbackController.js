const Feedback = require('../../schema/feedbackSchema');

// Create a new feedback
exports.createFeedback = async (req, res) => {
  try {
    const { userId, description } = req.body;

    const feedback = new Feedback({
      userId,
      description
    });

    await feedback.save();
    res.status(201).json({ message: 'Feedback created successfully', feedback });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all feedbacks
exports.getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate('userId', 'name'); // Assuming the User model has a 'name' field
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get a feedback by ID
exports.getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id).populate('userId', 'name');
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update a feedback
exports.updateFeedback = async (req, res) => {
  try {
    const { description } = req.body;

    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { description },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.status(200).json({ message: 'Feedback updated successfully', feedback });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a feedback
exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
