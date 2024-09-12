const PastFun = require('../..//schema/pastfunSchema');

// Create a new PastFun record
exports.createPastFun = async (req, res) => {
  try {
    const newPastFun = new PastFun(req.body);
    const savedPastFun = await newPastFun.save();
    res.status(201).json(savedPastFun);
  } catch (error) {
    console.error('Error creating PastFun record:', error);
    res.status(500).json({
      message: 'Error creating PastFun record',
      error: error.message
    });
  }
};

// Get all PastFun records
// Get all PastFun records
// Get all PastFun records without populating userId and groupId
exports.getAllPastFun = async (req, res) => {
    try {
      // Fetch all PastFun records without populating userId and groupId
      const pastFunRecords = await PastFun.find();
      res.status(200).json(pastFunRecords);
    } catch (error) {
      console.error('Error fetching PastFun records:', error);
      res.status(500).json({
        message: 'Error fetching PastFun records',
        error: error.message
      });
    }
  };
  
  // Get a specific PastFun record by ID without populating userId and groupId
  exports.getPastFunById = async (req, res) => {
    try {
      // Fetch the specific PastFun record by its ID
      const pastFunRecord = await PastFun.findById(req.params.id);
      
      if (!pastFunRecord) {
        return res.status(404).json({
          message: 'PastFun record not found'
        });
      }
  
      res.status(200).json(pastFunRecord);
    } catch (error) {
      console.error('Error fetching PastFun record:', error);
      res.status(500).json({
        message: 'Error fetching PastFun record',
        error: error.message
      });
    }
  };
  

// Update a PastFun record by ID
exports.updatePastFunById = async (req, res) => {
  try {
    const updatedPastFun = await PastFun.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPastFun) {
      return res.status(404).json({ message: 'PastFun record not found' });
    }
    res.status(200).json(updatedPastFun);
  } catch (error) {
    console.error('Error updating PastFun record:', error);
    res.status(500).json({
      message: 'Error updating PastFun record',
      error: error.message
    });
  }
};

// Delete a PastFun record by ID
exports.deletePastFunById = async (req, res) => {
  try {
    const deletedPastFun = await PastFun.findByIdAndDelete(req.params.id);
    if (!deletedPastFun) {
      return res.status(404).json({ message: 'PastFun record not found' });
    }
    res.status(200).json({ message: 'PastFun record deleted successfully' });
  } catch (error) {
    console.error('Error deleting PastFun record:', error);
    res.status(500).json({
      message: 'Error deleting PastFun record',
      error: error.message
    });
  }
};
