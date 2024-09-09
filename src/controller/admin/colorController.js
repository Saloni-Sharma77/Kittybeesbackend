const ColorModel = require('../../schema/colorSchema');


exports.addColor = async (req, res) => {
    try {
        const { name} = req.body;
        let alreadyexist = await ColorModel.findOne({name: name});
        if(alreadyexist){
          return res.status(200).json({error:"Color Already Exists"})
        }
        
        const newColor = new ColorModel({
            name
        });
  
        await newColor.save();
  
        res.status(201).json(newColor);
    } catch (error) {
        console.error('Error adding Color:', error);
        res.status(500).json({ error: 'Failed to add Color' });
    }
  };
  
   
  exports.updateColor = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
  
        const updatedColor = await ColorModel.findByIdAndUpdate(
            id,
            { name},
            { new: true, runValidators: true }
        );
  
        if (!updatedColor) {
            return res.status(404).json({ error: 'Color not found' });
        }
  
        res.json(updatedColor);
    } catch (error) {
        console.error('Error updating Color:', error);
        res.status(500).json({ error: 'Failed to update Color' });
    }
  };
  
  
    exports.getColorById = async (req, res) => {
      try {
          const { id } = req.params;
    
          const Color = await ColorModel.findById(id);
    
          if (!Color) {
              return res.status(404).json({ error: 'Color not found' });
          }
    
          res.json(Color);
      } catch (error) {
          console.error('Error fetching Color:', error);
          res.status(500).json({ error: 'Failed to fetch Color' });
      }
    };
     
    
    exports.getAllColor = async (req, res) => {
      try {
        const getAllColor = await ColorModel.find().sort({ createdAt: -1 });
        res.status(200).json({ 
          message: "Color retrieved successfully", 
          data: {events:getAllColor} 
        });
      } catch (err) {
        res.status(500).json({
          error: "Failed to get information",
          details: err.message,
        });
      }
    };
  
    exports.deleteColor = async (req, res) => {
      try {
          const { id } = req.params;
  
          const deletedColor = await ColorModel.findByIdAndDelete(id);
  
          if (!deletedColor) {
              return res.status(404).json({ error: 'Color not found' });
          }
  
          res.json({ message: 'Color deleted successfully' });
      } catch (error) {
          console.error('Error deleting Color:', error);
          res.status(500).json({ error: 'Failed to delete Color' });
      }
  };
  
  exports.updateColorStatus = async (req, res)=>{
    const ColorId = req.params.id; // Capture the ID from request parameters
    const {
      isActive
    } = req.body;
  
    try {
      const updatedColor = await ColorModel.findByIdAndUpdate(
        ColorId,
        {
          isActive
        },
        { new: true, runValidators: true } 
      );
  
      if (!updatedColor) {
        return res.status(404).json({
          error: "Color not found",
        });
      }
  
      // Send the updated user data with a 200 status code
      res.status(200).json({
        message: "Color information updated successfully",
        data: updatedColor,
      });
    } catch (error) {
      console.error("Error updating Color information:", error);
      res.status(500).json({
        error: "Failed to update Color information",
        details: error.message,
      });
    }
  }
  