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


/////

// Get all past kitties
exports.getPastKitties = async (req, res) => {
  try {
    const now = new Date();
    const pastKitties = await KittyDetail.find({ date: { $lt: now } });
    res.status(200).json(pastKitties);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving past kitties', error });
  }
};

// Get all future kitties
exports.getFutureKitties = async (req, res) => {
  try {
    const now = new Date();
    const futureKitties = await KittyDetail.find({ date: { $gte: now } }).populate('userId');
    res.status(200).json(futureKitties);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving future kitties', error });
  }
};


///

// Function to calculate the countdown for the upcoming kitty

// Function to calculate the countdown for the upcoming kitty
exports.getUpcomingKittyCountdown = async (req, res) => {
  try {
    // Get the current date and time
    const currentDate = new Date();

    // Find all kitty parties where the date is in the future, sorted by date (soonest first)
    const upcomingKitties = await KittyDetail.find({ date: { $gte: currentDate } }).sort({ date: 1 });

    // Check if any kitties are found
    if (!upcomingKitties.length) {
      return res.status(404).json({ message: "No upcoming kitty parties found" });
    }

    // Get the nearest upcoming kitty
    const nextKitty = upcomingKitties[0];

    // Calculate the difference between the current date and the upcoming kitty date
    const timeDifference = new Date(nextKitty.date) - currentDate;

    // Convert the time difference to days and hours
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    // Send the response with the kitty name and the countdown
    return res.status(200).json({
      kittyName: nextKitty.partyName,
      countdown: {
        days,
        hours
      }
    });
  } catch (error) {
    console.error("Error getting upcoming kitty countdown:", error);
    return res.status(500).json({ error: "An error occurred while fetching the countdown." });
  }
};