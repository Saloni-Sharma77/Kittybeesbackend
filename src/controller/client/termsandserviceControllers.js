const TermsAndServices = require('../../schema/termsandserviceSchema');

// Create a new Terms and Services document
exports.createTermsAndServices = async (req, res) => {
  try {
    const { termsAndServices } = req.body;
    const termsAndServicesDocument = new TermsAndServices({ termsAndServices });
    await termsAndServicesDocument.save();
    res.status(201).json(termsAndServicesDocument);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Terms and Services documents
exports.getTermsAndServices = async (req, res) => {
  try {
    const termsAndServices = await TermsAndServices.find();
    res.status(200).json(termsAndServices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single Terms and Services document by ID
exports.getTermsAndServicesById = async (req, res) => {
  try {
    const termsAndServices = await TermsAndServices.findById(req.params.id);
    if (!termsAndServices) {
      return res.status(404).json({ message: 'Terms and Services not found' });
    }
    res.status(200).json(termsAndServices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a Terms and Services document by ID
exports.updateTermsAndServices = async (req, res) => {
  try {
    const { termsAndServices } = req.body;
    const updatedDocument = await TermsAndServices.findByIdAndUpdate(
      req.params.id,
      { termsAndServices },
      { new: true }
    );
    if (!updatedDocument) {
      return res.status(404).json({ message: 'Terms and Services not found' });
    }
    res.status(200).json(updatedDocument);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a Terms and Services document by ID
exports.deleteTermsAndServices = async (req, res) => {
  try {
    const deletedDocument = await TermsAndServices.findByIdAndDelete(req.params.id);
    if (!deletedDocument) {
      return res.status(404).json({ message: 'Terms and Services not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
