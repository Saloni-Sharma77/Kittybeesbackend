
const ThemesModel = require("../../schema/themeSchema");

exports.addThemes = async (req, res) => {
  try {
      const { name ,image,backgroundimage} = req.body;
      const newThemes = new ThemesModel({
          name,
          image,
          backgroundimage,
      });

      await newThemes.save();

      res.status(201).json(newThemes);
  } catch (error) {
      console.error('Error adding Themes:', error);
      res.status(500).json({ error: 'Failed to add Themes' });
  }
};

 
exports.updateThemes = async (req, res) => {
  try {
      const { id } = req.params;
      const { name,image ,backgroundimage} = req.body;

      const updatedThemes = await ThemesModel.findByIdAndUpdate(
          id,
          { name,image,backgroundimage },
          { new: true, runValidators: true }
      );

      if (!updatedThemes) {
          return res.status(404).json({ error: 'Themes not found' });
      }

      res.json(updatedThemes);
  } catch (error) {
      console.error('Error updating Themes:', error);
      res.status(500).json({ error: 'Failed to update Themes' });
  }
};


  exports.getThemesById = async (req, res) => {
    try {
        const { id } = req.params;
  
        const Themes = await ThemesModel.findById(id);
  
        if (!Themes) {
            return res.status(404).json({ error: 'Themes not found' });
        }
  
        res.json(Themes);
    } catch (error) {
        console.error('Error fetching Themes:', error);
        res.status(500).json({ error: 'Failed to fetch Themes' });
    }
  };
   
  
  exports.getAllThemes = async (req, res) => {
    try {
      const getAllThemes = await ThemesModel.find().sort({ createdAt: -1 });
      res.status(200).json({ 
        message: "Themes retrieved successfully", 
        data: {events:getAllThemes} 
      });
    } catch (err) {
      res.status(500).json({
        error: "Failed to get information",
        details: err.message,
      });
    }
  };

  exports.deleteThemes = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedThemes = await ThemesModel.findByIdAndDelete(id);

        if (!deletedThemes) {
            return res.status(404).json({ error: 'Themes not found' });
        }

        res.json({ message: 'Themes deleted successfully' });
    } catch (error) {
        console.error('Error deleting Themes:', error);
        res.status(500).json({ error: 'Failed to delete Themes' });
    }
};

exports.updateThemesStatus = async (req, res)=>{
  const ThemesId = req.params.id; // Capture the ID from request parameters
  const {
    isActive
  } = req.body;

  console.log(req.body, "response");

  try {
    const updatedThemes = await ThemesModel.findByIdAndUpdate(
      ThemesId,
      {
        isActive
      },
      { new: true, runValidators: true } 
    );

    if (!updatedThemes) {
      return res.status(404).json({
        error: "Themes not found",
      });
    }

    // Send the updated user data with a 200 status code
    res.status(200).json({
      message: "Themes information updated successfully",
      data: updatedThemes,
    });
  } catch (error) {
    console.error("Error updating Themes information:", error);
    res.status(500).json({
      error: "Failed to update Themes information",
      details: error.message,
    });
  }
}
