const AddressModel = require("../../schema/addressSchema");


exports.createAddress = async (req, res) => {
    try {
      const newAddress = new AddressModel({
        address: req.body.address,
        description: req.body.description,
        userId: req.body.userId,
        isActive: req.body.isActive,
      });
  
      const savedAddress = await newAddress.save();
      res.status(201).json(savedAddress);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  exports.getAllAddresses = async (req, res) => {
    try {
      const addresses = await AddressModel.find();
      res.status(200).json(addresses);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

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

  exports.updateAddressById = async (req, res) => {
    try {
      const updatedAddress = await AddressModel.findByIdAndUpdate(
        req.params.id,
        {
          address: req.body.address,
          description: req.body.description,
          isActive: req.body.isActive,
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


  exports.getAddressByUserId = async (req, res) => {
    try {
      const address = await AddressModel.findOne({ userId: req.params.userId });
  
      if (!address) {
        return res.status(404).json({ error: 'Address not found' });
      }
  
      res.status(200).json(address);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

  
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
  