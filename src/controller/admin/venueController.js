const Venue = require("../../schema/venueSchema");

exports.addVenue = async (req, res) => {
  try {
    const {
        name ,
        userId,
        location,
        lat,
        long,
        image,
        pricing,
        contactNo,
    } = req.body;

    const newVenue= new Venue({
        name,
        location,
        userId,

        lat,
        long,
        image,
        pricing,
        contactNo,
    });

    await newVenue.save();

    res.status(201).json({ message: "Data added successfully", task: newVenue });
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).json({ error: "Failed to add data" });

  }
};
exports.getAllVenues = async (req, res) => {
  try {
    const getAllVenue = await Venue.find().sort({ createdAt: -1 }) ;
   
    res
      .status(200)
      .json({ message: "Data fetched successfully", data: getAllVenue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllVenuesHostedbyMe = async (req, res) => {
  try {
    const userId  = req.params.id;

    const getAllVenue = await Venue.find({ userId: userId }).sort({ createdAt: -1 }) ;
   
    res
      .status(200)
      .json({ message: "Data fetched successfully", data: getAllVenue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getVenueById = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await Venue.findById(id);
    if (!user) {
      return res.status(404).json({ error: "Request not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching Venue Request by ID:", error);
    res.status(500).json({ error: "Failed to fetch user by ID" });
  }
};
exports.updateVenue = async (req, res) => {
  try {
    const {
        name ,
        userId,
        location,
        lat,
        long,
        image,
        pricing,
        contactNo,
      VenueMembers} = req.body;
    const updatedVenue = await Venue.findByIdAndUpdate(
      req.params.id,
    {
        name ,
        userId,
        location,
        lat,
        long,
        image,
        pricing,
        contactNo,

    },
      { new: true }
    );
    if (!updatedVenue) {
      return res.status(404).json({ error: "Venue not found" });
    }
    res.status(200).json(updatedVenue);
  } catch (err) {
    console.error("Error updating Venue:", err);
    res.status(500).json({ error: "Failed to update Venue" });
  }
};
exports.deleteVenue = async (req, res) => {
  try {
    const deletedVenue = await Venue.findByIdAndDelete(req.params.id);
    if (!deletedVenue) {
      return res.status(404).json({ error: "Data not found" });
    }
    res.status(200).json({ message: "Data deleted successfully" });
  } catch (err) {
    console.error("Error deleting Venue:", err);
    res.status(500).json({ error: "Failed to delete Venue" });
  }
};

exports.updateStatus = async (req, res)=>{
  const venueId = req.params.id; // Capture the ID from request parameters
  const {
    isActive
  } = req.body;

  console.log(req.body, "response");

  try {
    const updatedVenue = await Venue.findByIdAndUpdate(
      venueId,
      {
        isActive
      },
      { new: true, runValidators: true } 
    );

    if (!updatedVenue) {
      return res.status(404).json({
        error: "Venue not found",
      });
    }

    // Send the updated user data with a 200 status code
    res.status(200).json({
      message: "Venue information updated successfully",
      data: updatedVenue,
    });
  } catch (error) {
    console.error("Error updating venue information:", error);
    res.status(500).json({
      error: "Failed to update venue information",
      details: error.message,
    });
  }
}













