const City = require('../../schema/citySchema'); // Adjust path if necessary

// Create a new city

exports.createCity = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if a city with the same name already exists
    const existingCity = await City.findOne({ name });
    if (existingCity) {
      return res.status(400).json({ message: "City already exists" });
    }

    const city = new City(req.body);
    await city.save();
    res.status(201).json({ message: "City created successfully", city });
  } catch (err) {
    // Handle duplicate key error for schema-level validation
    if (err.code === 11000) {
      return res.status(400).json({ message: "City already exists" });
    }
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// Get all cities
exports.getAllCities = async (req, res) => {
  try {
    const cities = await City.find();
    res.status(200).json({ message: "Cities fetched successfully", cities });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// Get a city by ID
exports.getCityById = async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) return res.status(404).json({ message: "City not found" });
    res.status(200).json({ message: "City fetched successfully", city });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// Update a city by ID
exports.updateCity = async (req, res) => {
  try {
    const city = await City.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!city) return res.status(404).json({ message: "City not found" });
    res.status(200).json({ message: "City updated successfully", city });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// Delete a city by ID
exports.deleteCity = async (req, res) => {
  try {
    const city = await City.findByIdAndDelete(req.params.id);
    if (!city) return res.status(404).json({ message: "City not found" });
    res.status(200).json({ message: "City deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};
