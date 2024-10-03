const AddressModel = require("../../schema/addressSchema");

// Create Address
exports.createAddress = async (req, res) => {
    try {
        const newAddress = new AddressModel({
            title: req.body.title, // Updated to title
            address: req.body.address, // Address field
            userId:req.body.userId,
            location: req.body.location, // Location field
            isActive: req.body.isActive,
            lat: req.body.lat,  
            long: req.body.long  ,
            image: req.body.image ,
            pricing:req.body.pricing,

        });

        const savedAddress = await newAddress.save();
        res.status(201).json(savedAddress);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get All Addresses
exports.getAllAddresses = async (req, res) => {
    try {
        const addresses = await AddressModel.find();
        res.status(200).json(addresses);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get Address By ID
exports.getAddressById = async (req, res) => {
    try {
        const address = await AddressModel.findById(req.params.id);
        if (!address) {
            return res.status(404).json({ error: 'Address not found' });
        }
        res.status(200).json(address);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update Address By ID
exports.updateAddressById = async (req, res) => {
    try {
        const updatedAddress = await AddressModel.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title, // Updated to title
                address: req.body.address, // Address field
                location: req.body.location, // Location field
                isActive: req.body.isActive,
                 userId:req.body.userId,
                 lat: req.body.lat,  
                 long: req.body.long  ,
                 image: req.body.image ,
                 pricing:req.body.pricing,

            },
            { new: true }
        );

        if (!updatedAddress) {
            return res.status(404).json({ error: 'Address not found' });
        }

        res.status(200).json(updatedAddress);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete Address By ID
exports.deleteAddressById = async (req, res) => {
    try {
        const deletedAddress = await AddressModel.findByIdAndDelete(req.params.id);
        if (!deletedAddress) {
            return res.status(404).json({ error: 'Address not found' });
        }
        res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getAddressByUserId = async (req, res) => {
    try {
      const address = await AddressModel.find({ userId: req.params.userId });
  
      if (!address) {
        return res.status(404).json({ error: 'Address not found' });
      }
  
      res.status(200).json(address);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  