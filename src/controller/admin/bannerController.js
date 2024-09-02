const BannerModel = require('../../schema/bannerSchema');


exports.addBanner = async (req, res) => {
    try {
        const { image,video} = req.body;
        const newBanner = new BannerModel({
            image,video
        });
  
        await newBanner.save();
  
        res.status(201).json(newBanner);
    } catch (error) {
        console.error('Error adding Banner:', error);
        res.status(500).json({ error: 'Failed to add Banner' });
    }
  };
  
   
  exports.updateBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const { image,video } = req.body;
  
        const updatedBanner = await BannerModel.findByIdAndUpdate(
            id,
            { image ,video},
            { new: true, runValidators: true }
        );
  
        if (!updatedBanner) {
            return res.status(404).json({ error: 'Banner not found' });
        }
  
        res.json(updatedBanner);
    } catch (error) {
        console.error('Error updating Banner:', error);
        res.status(500).json({ error: 'Failed to update Banner' });
    }
  };
  
  
    exports.getBannerById = async (req, res) => {
      try {
          const { id } = req.params;
    
          const Banner = await BannerModel.findById(id);
    
          if (!Banner) {
              return res.status(404).json({ error: 'Banner not found' });
          }
    
          res.json(Banner);
      } catch (error) {
          console.error('Error fetching Banner:', error);
          res.status(500).json({ error: 'Failed to fetch Banner' });
      }
    };
     
    
    exports.getAllBanner = async (req, res) => {
      try {
        const getAllBanner = await BannerModel.find().sort({ createdAt: -1 });
        res.status(200).json({ 
          message: "Banner retrieved successfully", 
          data: {events:getAllBanner} 
        });
      } catch (err) {
        res.status(500).json({
          error: "Failed to get information",
          details: err.message,
        });
      }
    };
  
    exports.deleteBanner = async (req, res) => {
      try {
          const { id } = req.params;
  
          const deletedBanner = await BannerModel.findByIdAndDelete(id);
  
          if (!deletedBanner) {
              return res.status(404).json({ error: 'Banner not found' });
          }
  
          res.json({ message: 'Banner deleted successfully' });
      } catch (error) {
          console.error('Error deleting Banner:', error);
          res.status(500).json({ error: 'Failed to delete Banner' });
      }
  };
  
  exports.updateBannerStatus = async (req, res)=>{
    const BannerId = req.params.id; // Capture the ID from request parameters
    const {
      isActive
    } = req.body;
  
    try {
      const updatedBanner = await BannerModel.findByIdAndUpdate(
        BannerId,
        {
          isActive
        },
        { new: true, runValidators: true } 
      );
  
      if (!updatedBanner) {
        return res.status(404).json({
          error: "Banner not found",
        });
      }
  
      // Send the updated user data with a 200 status code
      res.status(200).json({
        message: "Banner information updated successfully",
        data: updatedBanner,
      });
    } catch (error) {
      console.error("Error updating Banner information:", error);
      res.status(500).json({
        error: "Failed to update Banner information",
        details: error.message,
      });
    }
  }
  