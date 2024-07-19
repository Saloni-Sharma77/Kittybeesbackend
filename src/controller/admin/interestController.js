
const InterestModel = require("../../schema/interestSchema");

exports.addInterest = async (req, res) => {
    try {
        const { name } = req.body;
  
        const newInterest = new InterestModel({
            name,
        });
  
        await newInterest.save();
  
        res.status(201).json(newInterest);
    } catch (error) {
        console.error('Error adding interest:', error);
        res.status(500).json({ error: 'Failed to add interest' });
    }
  };
  
  exports.getInterestById = async (req, res) => {
    try {
        const { id } = req.params;
  
        const interest = await InterestModel.findById(id);
  
        if (!interest) {
            return res.status(404).json({ error: 'Interest not found' });
        }
  
        res.json(interest);
    } catch (error) {
        console.error('Error fetching interest:', error);
        res.status(500).json({ error: 'Failed to fetch interest' });
    }
  };
  
  exports.updateInterest = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
  
        const updatedInterest = await InterestModel.findByIdAndUpdate(
            id,
            { name },
            { new: true, runValidators: true }
        );
  
        if (!updatedInterest) {
            return res.status(404).json({ error: 'Interest not found' });
        }
  
        res.json(updatedInterest);
    } catch (error) {
        console.error('Error updating interest:', error);
        res.status(500).json({ error: 'Failed to update interest' });
    }
  };
  
  
  
  exports.sendInterestAndPreference = async (req, res) => {
    try {
      const getAllInterest = await InterestModel.find().sort({ createdAt: -1 });
      res.status(200).json({ 
        message: "Interest retrieved successfully", 
        data: {events:getAllInterest} 
      });
    } catch (err) {
      res.status(500).json({
        error: "Failed to get information",
        details: err.message,
      });
    }
  };

  exports.deleteInterest = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedInterest = await InterestModel.findByIdAndDelete(id);

        if (!deletedInterest) {
            return res.status(404).json({ error: 'Interest not found' });
        }

        res.json({ message: 'Interest deleted successfully' });
    } catch (error) {
        console.error('Error deleting interest:', error);
        res.status(500).json({ error: 'Failed to delete interest' });
    }
};
