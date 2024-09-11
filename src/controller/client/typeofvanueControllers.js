const VenueType = require('../../schema/typeofvanueSchema'); // Adjust path as necessary

// Create a new VenueType
exports.createVenueType = async (req, res) => {
    try {
        const newVenueType = new VenueType(req.body);
        await newVenueType.save();
        res.status(201).json({ message: "VenueType created successfully", data: newVenueType });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: "Error creating VenueType", error: err.message });
    }
};

// Get all VenueTypes
exports.getAllVenueTypes = async (req, res) => {
    try {
        const venueTypes = await VenueType.find();
        res.status(200).json({ message: "VenueTypes fetched successfully", data: venueTypes });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get VenueType by ID
exports.getVenueTypeById = async (req, res) => {
    try {
        const { id } = req.params;
        const venueType = await VenueType.findById(id);
        if (!venueType) {
            return res.status(404).json({ message: "VenueType not found" });
        }
        res.status(200).json({ message: "VenueType fetched successfully", data: venueType });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update VenueType by ID
exports.updateVenueTypeById = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedVenueType = await VenueType.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedVenueType) {
            return res.status(404).json({ message: "VenueType not found" });
        }
        res.status(200).json({ message: "VenueType updated successfully", data: updatedVenueType });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: "Error updating VenueType", error: err.message });
    }
};

// Delete VenueType by ID
exports.deleteVenueTypeById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedVenueType = await VenueType.findByIdAndDelete(id);
        if (!deletedVenueType) {
            return res.status(404).json({ message: "VenueType not found" });
        }
        res.status(200).json({ message: "VenueType deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};
