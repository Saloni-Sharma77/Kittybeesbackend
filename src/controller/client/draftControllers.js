const Draft = require('../../schema/draftSchema');

// Add a draft
exports.addToDraft = async (req, res) => {
  try {
    const {
      name,
      groupId,
      date,
      time,
      image,
      themeId,
      instructions,
      colorId,
      venueId,
      activityId,
      templateId,
      addressId,
      theamepoll,
      locationpoll,
      venuepoll,
      userId
    } = req.body;

    const newDraft = new Draft({
      name,
      groupId,
      date,
      time,
      image,
      themeId,
      addressId,
      instructions,
      colorId,
      venueId,
      activityId,
      templateId,
      theamepoll,
      locationpoll,
      venuepoll,
      userId,
      isDraft: true // Mark as draft
    });

    await newDraft.save();
    res.status(201).json({ message: "Draft added successfully", draft: newDraft });
  } catch (err) {
    console.error("Error adding draft", err);
    res.status(500).json({ error: "Failed to add draft" });
  }
};

// Get all drafts by userId
exports.getDraftByUserId = async (req, res) => {
  const userId = req.params.userId; // Capture the userId from request parameters

  try {
    const drafts = await Draft.find({ userId, isDraft: true }).sort({ createdAt: -1 });

    res.status(200).json({ message: "Drafts fetched successfully", data: drafts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all drafts
exports.getAllDrafts = async (req, res) => {
  try {
    const drafts = await Draft.find({ isDraft: true }).sort({ createdAt: -1 });

    res.status(200).json({ message: "All drafts fetched successfully", data: drafts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
