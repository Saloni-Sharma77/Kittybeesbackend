const PageModel = require('../../schema/pageSchema');

// Get all pages
exports.getAllPages = async (req, res) => {
  try {
    const pages = await PageModel.find();
    res.status(200).json(pages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new page
exports.addPage = async (req, res) => {
  try {
    const { pageName } = req.body;

    // Check if the page already exists
    const existingPage = await PageModel.findOne({ pageName });
    if (existingPage) {
      return res.status(400).json({ message: 'Page already exists' });
    }

    const newPage = new PageModel({ pageName });
    const savedPage = await newPage.save();
    res.status(201).json(savedPage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// // // Get a page by ID
// // exports.getPageById = async (req, res) => {
// //   try {
// //     const page = await PageModel.findById(req.params.id);
// //     if (!page) {
// //       return res.status(404).json({ message: 'Page not found' });
// //     }
// //     res.status(200).json(page);
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };

// // // Update a page by ID
// // exports.updatePage = async (req, res) => {
// //   try {
// //     const updatedPage = await PageModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
// //     if (!updatedPage) {
// //       return res.status(404).json({ message: 'Page not found' });
// //     }
// //     res.status(200).json(updatedPage);
// //   } catch (err) {
// //     res.status(400).json({ message: err.message });
// //   }
// // };

// // // Delete a page by ID
// // exports.deletePage = async (req, res) => {
// //   try {
// //     const deletedPage = await PageModel.findByIdAndDelete(req.params.id);
// //     if (!deletedPage) {
// //       return res.status(404).json({ message: 'Page not found' });
// //     }
// //     res.status(200).json({ message: 'Page deleted successfully' });
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };
