// controllers/memoriesControllers.js

const Memories = require('../../schema/memoriesSchema');

// Add new image (memory)
exports.addMemory = async (req, res) => {
  try {
    const { userId, image } = req.body;
    const newMemory = new Memories({ userId, image });
    await newMemory.save();
    res.status(201).json({ message: 'Memory added successfully', data: newMemory });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add memory', error });
  }
};

// Get memories by userId
exports.getMemoriesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const memories = await Memories.find({ userId });
    if (memories.length === 0) {
      return res.status(404).json({ message: 'No memories found for this user' });
    }
    res.status(200).json({ message: 'Memories retrieved successfully', data: memories });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve memories', error });
  }
};

// Update a memory (image)
exports.updateMemory = async (req, res) => {
  try {
    const { id } = req.params;
    const { image } = req.body;
    const updatedMemory = await Memories.findByIdAndUpdate(id, { image }, { new: true });
    if (!updatedMemory) {
      return res.status(404).json({ message: 'Memory not found' });
    }
    res.status(200).json({ message: 'Memory updated successfully', data: updatedMemory });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update memory', error });
  }
};

// Delete a memory
exports.deleteMemory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMemory = await Memories.findByIdAndDelete(id);
    if (!deletedMemory) {
      return res.status(404).json({ message: 'Memory not found' });
    }
    res.status(200).json({ message: 'Memory deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete memory', error });
  }
};




// Get all memories with associated usernames
exports.getAllMemories = async (req, res) => {
    try {
      const memories = await Memories.find().populate('userId', 'username'); // Populating username field from Users collection
  
      if (!memories || memories.length === 0) {
        return res.status(404).json({ message: 'No memories found' });
      }
  
      res.status(200).json({
        message: 'Memories retrieved successfully',
        data: memories
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve memories', error });
    }
  };
