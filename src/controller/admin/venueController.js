const Venue = require("../../schema/venueSchema");

exports.addVenue = async (req, res) => {
  try {
    const {
        name ,
        userId,
        VenueIcon ,
        VenueType,
        description,
      rulesAndRegulation,
      kittyFrequency,
      VenueCityArea,
      contributionAmount,
      VenueMembers,
     
    } = req.body;

    const newVenue= new Venue({
        name ,
        userId,
        VenueIcon ,
        VenueType,
        description,
      rulesAndRegulation,
      kittyFrequency,
      VenueCityArea,
      contributionAmount,
      VenueMembers,
     
    });

    await newVenue.save();

    res.status(201).json({ message: "Venue added successfully", task: newVenue });
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).json({ error: "Failed to add Venue" });
  }
};
exports.getAllVenues = async (req, res) => {
  try {
    const getAllVenue = await Venue.find() ;
   
    res
      .status(200)
      .json({ message: "Venue List fetched successfully", data: getAllVenue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getVenueById = async (req, res) => {
  const VenueId = req.params.id;

  try {
    const user = await Venue.findById(VenueId);
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
        VenueIcon ,
        VenueType,
        userId,
        description,
      rulesAndRegulation,
      kittyFrequency,
      VenueCityArea,
      contributionAmount,
      VenueMembers} = req.body;
    const updatedVenue = await Venue.findByIdAndUpdate(
      req.params.id,
    {
        name ,
        userId,
        VenueIcon ,
        VenueType,
        description,
      rulesAndRegulation,
      kittyFrequency,
      VenueCityArea,
      contributionAmount,
      VenueMembers,
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













