// const CityModel = require('../../schema/citySchema');


// exports.addCity = async (req, res) => {
//     try {
//         const { name} = req.body;
//         const newCity = new CityModel({
//             name
//         });
  
//         await newCity.save();
  
//         res.status(201).json(newCity);
//     } catch (error) {
//         console.error('Error adding City:', error);
//         res.status(500).json({ error: 'Failed to add City' });
//     }
//   };
  
   
//   exports.updateCity = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { name } = req.body;
  
//         const updatedCity = await CityModel.findByIdAndUpdate(
//             id,
//             { name},
//             { new: true, runValidators: true }
//         );
  
//         if (!updatedCity) {
//             return res.status(404).json({ error: 'City not found' });
//         }
  
//         res.json(updatedCity);
//     } catch (error) {
//         console.error('Error updating City:', error);
//         res.status(500).json({ error: 'Failed to update City' });
//     }
//   };
  
  
//     exports.getCityById = async (req, res) => {
//       try {
//           const { id } = req.params;
    
//           const City = await CityModel.findById(id);
    
//           if (!City) {
//               return res.status(404).json({ error: 'City not found' });
//           }
    
//           res.json(City);
//       } catch (error) {
//           console.error('Error fetching City:', error);
//           res.status(500).json({ error: 'Failed to fetch City' });
//       }
//     };
     
    
//     exports.getAllCity = async (req, res) => {
//       try {
//         const getAllCity = await CityModel.find().sort({ createdAt: -1 });
//         res.status(200).json({ 
//           message: "City retrieved successfully", 
//           data: {events:getAllCity} 
//         });
//       } catch (err) {
//         res.status(500).json({
//           error: "Failed to get information",
//           details: err.message,
//         });
//       }
//     };
  
//     exports.deleteCity = async (req, res) => {
//       try {
//           const { id } = req.params;
  
//           const deletedCity = await CityModel.findByIdAndDelete(id);
  
//           if (!deletedCity) {
//               return res.status(404).json({ error: 'City not found' });
//           }
  
//           res.json({ message: 'City deleted successfully' });
//       } catch (error) {
//           console.error('Error deleting City:', error);
//           res.status(500).json({ error: 'Failed to delete City' });
//       }
//   };
  
//   exports.updateCityStatus = async (req, res)=>{
//     const CityId = req.params.id; // Capture the ID from request parameters
//     const {
//       isActive
//     } = req.body;
  
//     try {
//       const updatedCity = await CityModel.findByIdAndUpdate(
//         CityId,
//         {
//           isActive
//         },
//         { new: true, runValidators: true } 
//       );
  
//       if (!updatedCity) {
//         return res.status(404).json({
//           error: "City not found",
//         });
//       }
  
//       // Send the updated user data with a 200 status code
//       res.status(200).json({
//         message: "City information updated successfully",
//         data: updatedCity,
//       });
//     } catch (error) {
//       console.error("Error updating City information:", error);
//       res.status(500).json({
//         error: "Failed to update City information",
//         details: error.message,
//       });
//     }
//   }
  