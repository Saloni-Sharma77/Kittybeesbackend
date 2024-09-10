const Type = require('../../schema/typeofvanueSchema'); // Adjust path as necessary

// Create a new Type
exports.createType = async (req, res) => {
    try {
        const newType = new Type(req.body);
        await newType.save();
        res.status(201).json({ message: "Type created successfully", data: newType });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: "Error creating type", error: err.message });
    }
};

// Get all Types
exports.getAllTypes = async (req, res) => {
    try {
        const types = await Type.find();
        res.status(200).json({ message: "Types fetched successfully", data: types });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get Type by ID
exports.getTypeById = async (req, res) => {
    try {
        const { id } = req.params;
        const type = await Type.findById(id);
        if (!type) {
            return res.status(404).json({ message: "Type not found" });
        }
        res.status(200).json({ message: "Type fetched successfully", data: type });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update Type by ID
exports.updateTypeById = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedType = await Type.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedType) {
            return res.status(404).json({ message: "Type not found" });
        }
        res.status(200).json({ message: "Type updated successfully", data: updatedType });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: "Error updating type", error: err.message });
    }
};

// Delete Type by ID
exports.deleteTypeById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedType = await Type.findByIdAndDelete(id);
        if (!deletedType) {
            return res.status(404).json({ message: "Type not found" });
        }
        res.status(200).json({ message: "Type deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};
