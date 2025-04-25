const Draft = require('../../schema/draftSchema');
const VenueReviewSchema = require('../../schema/venueReviewSchema');


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
    const drafts = await Draft.find({ userId, isDraft: true })
      .populate("userId")      // Populate user details
      .populate("groupId")     // Populate group details
      .populate("venueId")     // Populate venue details
      .populate("themeId")     // Populate theme details
      .populate("colorId")     // Populate color details
      .populate("addressId")   // Populate address details
      .populate("activityId")  // Populate activity details
      .sort({ createdAt: -1 });

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

exports.deleteDraft = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the draft by ID and delete it
    const deletedDraft = await Draft.findByIdAndDelete(id);

    if (!deletedDraft) {
      return res.status(404).json({ message: "Draft not found" });
    }

    return res.status(200).json({ message: "Draft deleted successfully", deletedDraft });
  } catch (error) {
    console.error("Error deleting draft:", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};



// Update a draft by ID
exports.updateDraft = async (req, res) => {
  try {
    const { draftId } = req.params; // Get draft ID from URL params
    const updateData = req.body; // Get updated data from request body

    // Find draft by ID and update it
    const updatedDraft = await Draft.findByIdAndUpdate(
      draftId,
      updateData,
      { new: true, runValidators: true } // Return updated document & validate
    );

    if (!updatedDraft) {
      return res.status(404).json({ message: "Draft not found" });
    }

    res.status(200).json({ message: "Draft updated successfully", data: updatedDraft });
  } catch (error) {
    console.error("Error updating draft:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




// Get Draft by ID
exports.getDraftById = async (req, res) => {
  const draftId = req.params.id; // Get draft ID from URL params
  const userId = req.query.userId; // Get userId from query params (if needed for additional checks)

  try {
    // Find the draft by ID and populate related fields
    const draft = await Draft.findById(draftId)
      .populate({
        path: 'groupId',
        populate: {
          path: 'userId',
          model: 'Users',
        },
      })
      .populate('userId')
      .populate('themeId')
      .populate('colorId')
      .populate('venueId')
      .populate('addressId')
      .populate('activityId')
      .populate('templateId');

    // If draft not found
    if (!draft) {
      return res.status(404).json({ error: 'Draft not found' });
    }

    // Check if the user is the owner or part of the draft (optional logic)
    let isOwnerOrMember = false;
    if (userId) {
      if (draft.userId && draft.userId._id.toString() === userId) {
        isOwnerOrMember = true;
      }
      if (draft.groupId && draft.groupId.some(group => group.userId._id.toString() === userId)) {
        isOwnerOrMember = true;
      }
    }

    // Get venue reviews (optional, just an example)
    let venueReviews = await VenueReviewSchema.find({ venueId: draft.venueId });
    
    res.status(200).json({
      message: 'Draft fetched successfully',
      data: draft,
      venueReviews: venueReviews.length || 0,
      isOwnerOrMember, // Pass the flag to indicate if the user is part of the draft
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
