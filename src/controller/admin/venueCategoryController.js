// controllers/venueCategoryController.js
const VenueCategory = require('../../schema/venueCategorySchema');

// Create a new venue category
exports.createVenueCategory = async (req, res) => {
    try {
        const venueCategory = new VenueCategory(req.body);
        await venueCategory.save();
        res.status(201).json(venueCategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all venue categories
exports.getAllVenueCategories = async (req, res) => {
    try {
        const venueCategories = await VenueCategory.find();
        res.status(200).json(venueCategories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single venue category by ID
exports.getVenueCategoryById = async (req, res) => {
    try {
        const venueCategory = await VenueCategory.findById(req.params.id);
        if (!venueCategory) return res.status(404).json({ message: 'Venue Category not found' });
        res.status(200).json(venueCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a venue category by ID
exports.updateVenueCategory = async (req, res) => {
    try {
        const venueCategory = await VenueCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!venueCategory) return res.status(404).json({ message: 'Venue Category not found' });
        res.status(200).json(venueCategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a venue category by ID
exports.deleteVenueCategory = async (req, res) => {
    try {
        const venueCategory = await VenueCategory.findByIdAndDelete(req.params.id);
        if (!venueCategory) return res.status(404).json({ message: 'Venue Category not found' });
        res.status(200).json({ message: 'Venue Category deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
