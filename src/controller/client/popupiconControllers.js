// controllers/iconControllers.js

const Icon = require('../../schema/popupiconschema');

// Add a new icon
exports.addIcon = async (req, res) => {
  try {
    const { name, image } = req.body;
    const newIcon = new Icon({ name, image });
    await newIcon.save();
    res.status(201).json({ message: 'Icon added successfully', data: newIcon });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add icon', error });
  }
};

// Get all icons
exports.getAllIcons = async (req, res) => {
  try {
    const icons = await Icon.find();
    res.status(200).json({ message: 'Icons retrieved successfully', data: icons });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve icons', error });
  }
};

// Update an icon
exports.updateIcon = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image } = req.body;
    const updatedIcon = await Icon.findByIdAndUpdate(id, { name, image }, { new: true });
    if (!updatedIcon) {
      return res.status(404).json({ message: 'Icon not found' });
    }
    res.status(200).json({ message: 'Icon updated successfully', data: updatedIcon });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update icon', error });
  }
};

// Delete an icon
exports.deleteIcon = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedIcon = await Icon.findByIdAndDelete(id);
    if (!deletedIcon) {
      return res.status(404).json({ message: 'Icon not found' });
    }
    res.status(200).json({ message: 'Icon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete icon', error });
  }
};
