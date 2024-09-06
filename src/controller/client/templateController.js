const Template = require('../../schema/templateSchema');

// Create a new template entry
exports.createTemplate = async (req, res) => {
    try {
        const { name, image } = req.body;
        const newTemplate = new Template({ name, image });
        await newTemplate.save();
        res.status(201).json({ message: 'Template created successfully', data: newTemplate });
    } catch (error) {
        res.status(500).json({ message: 'Error creating template', error });
    }
};

// Get all templates
exports.getAllTemplates = async (req, res) => {
    try {
        const templates = await Template.find();
        res.status(200).json({ message: 'Templates fetched successfully', data: templates });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching templates', error });
    }
};

// Get template by ID
exports.getTemplateById = async (req, res) => {
    try {
        const template = await Template.findById(req.params.id);
        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }
        res.status(200).json({ message: 'Template fetched successfully', data: template });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching template', error });
    }
};

// Update template by ID
exports.updateTemplateById = async (req, res) => {
    try {
        const { name, image } = req.body;
        const updatedTemplate = await Template.findByIdAndUpdate(req.params.id, { name, image }, { new: true });
        if (!updatedTemplate) {
            return res.status(404).json({ message: 'Template not found' });
        }
        res.status(200).json({ message: 'Template updated successfully', data: updatedTemplate });
    } catch (error) {
        res.status(500).json({ message: 'Error updating template', error });
    }
};

// Delete template by ID
exports.deleteTemplateById = async (req, res) => {
    try {
        const template = await Template.findByIdAndDelete(req.params.id);
        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }
        res.status(200).json({ message: 'Template deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting template', error });
    }
};
