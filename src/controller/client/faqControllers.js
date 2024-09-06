const FAQ = require('../../schema/faqSchema');

// Add a new FAQ
exports.addFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const newFAQ = new FAQ({ question, answer });
    await newFAQ.save();
    res.status(201).json({ message: 'FAQ added successfully', faq: newFAQ });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add FAQ', details: err.message });
  }
};

// Get all FAQs
exports.getAllFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ createdAt: -1 });
    res.status(200).json({ message: 'FAQs fetched successfully', data: faqs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch FAQs', details: err.message });
  }
};

// Get FAQ by ID
exports.getFAQById = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }
    res.status(200).json({ message: 'FAQ fetched successfully', data: faq });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch FAQ', details: err.message });
  }
};

// Update FAQ
exports.updateFAQ = async (req, res) => {
  try {
    const { question, answer, isActive } = req.body;
    const updatedFAQ = await FAQ.findByIdAndUpdate(
      req.params.id,
      { question, answer, isActive },
      { new: true, runValidators: true }
    );

    if (!updatedFAQ) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    res.status(200).json({ message: 'FAQ updated successfully', data: updatedFAQ });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update FAQ', details: err.message });
  }
};

// Delete FAQ
exports.deleteFAQ = async (req, res) => {
  try {
    const deletedFAQ = await FAQ.findByIdAndDelete(req.params.id);
    if (!deletedFAQ) {
      return res.status(404).json({ error: 'FAQ not found' });
    }
    res.status(200).json({ message: 'FAQ deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete FAQ', details: err.message });
  }
};
