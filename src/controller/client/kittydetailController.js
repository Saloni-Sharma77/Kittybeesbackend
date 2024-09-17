const KittyDetail = require('../../schema/kittedetailSchema');

// Create a new Kitty Detail
exports.createKittyDetail = async (req, res) => {
  try {
    const kittyDetail = new KittyDetail(req.body);
    const savedKittyDetail = await kittyDetail.save();
    res.status(201).json(savedKittyDetail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Kitty Details
exports.getAllKittyDetails = async (req, res) => {
  try {
    const kittyDetails = await KittyDetail.find();
    res.status(200).json(kittyDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single Kitty Detail by ID
exports.getKittyDetailById = async (req, res) => {
  try {
    const kittyDetail = await KittyDetail.findById(req.params.id);
    if (!kittyDetail) {
      return res.status(404).json({ message: 'Kitty Detail not found' });
    }
    res.status(200).json(kittyDetail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a Kitty Detail by ID
exports.updateKittyDetail = async (req, res) => {
  try {
    const updatedKittyDetail = await KittyDetail.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedKittyDetail) {
      return res.status(404).json({ message: 'Kitty Detail not found' });
    }
    res.status(200).json(updatedKittyDetail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a Kitty Detail by ID
exports.deleteKittyDetail = async (req, res) => {
  try {
    const deletedKittyDetail = await KittyDetail.findByIdAndDelete(req.params.id);
    if (!deletedKittyDetail) {
      return res.status(404).json({ message: 'Kitty Detail not found' });
    }
    res.status(200).json({ message: 'Kitty Detail deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//




// Function to rate a kitty
exports.rateKitty = async (req, res) => {
  try {
    const { kittyId, userId, rating } = req.body;

    if (!kittyId || !userId || !rating) {
      return res.status(400).json({ message: 'Kitty ID, User ID, and Rating are required' });
    }

    // Check if the kitty exists
    const kitty = await KittyDetail.findById(kittyId);
    if (!kitty) {
      return res.status(404).json({ message: 'Kitty not found' });
    }

    // Check if the date and time have passed
    const now = new Date();
    const kittyDateTime = new Date(`${kitty.date} ${kitty.time}`);
    if (now < kittyDateTime) {
      return res.status(400).json({ message: 'You can only rate the kitty after the event has passed' });
    }

    // Check if the user has already rated this kitty
    const existingRating = kitty.ratings.find(r => r.userId.toString() === userId);
    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this kitty' });
    }

    // Add the rating
    kitty.ratings.push({ userId, rating });
    await kitty.save();

    res.status(200).json({ message: 'Kitty rated successfully', kitty });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};