// postsharecontroller.js
const PostShare = require('../../schema/postshareSchema');


// Create a new post share
exports.createPostShare = async (req, res) => {
    try {
        const postShare = new PostShare(req.body);
        await postShare.save();
        res.status(201).json(postShare);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all post shares
exports.getPostShares = async (req, res) => {
    try {
        const postShares = await PostShare.find();
        res.status(200).json(postShares);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a specific post share by ID
exports.getPostShareById = async (req, res) => {
    try {
        const postShare = await PostShare.findById(req.params.id);
        if (!postShare) {
            return res.status(404).json({ message: 'Post Share not found' });
        }
        res.status(200).json(postShare);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a specific post share by ID
exports.updatePostShare = async (req, res) => {
    try {
        const postShare = await PostShare.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!postShare) {
            return res.status(404).json({ message: 'Post Share not found' });
        }
        res.status(200).json(postShare);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a specific post share by ID
exports.deletePostShare = async (req, res) => {
    try {
        const postShare = await PostShare.findByIdAndDelete(req.params.id);
        if (!postShare) {
            return res.status(404).json({ message: 'Post Share not found' });
        }
        res.status(200).json({ message: 'Post Share deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new post share
exports.createPostShare = async (req, res) => {
    try {
        const postShare = new PostShare(req.body);
        await postShare.save();
        res.status(201).json(postShare);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all post shares
exports.getPostShares = async (req, res) => {
    try {
        const postShares = await PostShare.find();
        res.status(200).json(postShares);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a specific post share by ID
exports.getPostShareById = async (req, res) => {
    try {
        const postShare = await PostShare.findById(req.params.id);
        if (!postShare) {
            return res.status(404).json({ message: 'Post Share not found' });
        }
        res.status(200).json(postShare);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a specific post share by ID
exports.updatePostShare = async (req, res) => {
    try {
        const postShare = await PostShare.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!postShare) {
            return res.status(404).json({ message: 'Post Share not found' });
        }
        res.status(200).json(postShare);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a specific post share by ID
exports.deletePostShare = async (req, res) => {
    try {
        const postShare = await PostShare.findByIdAndDelete(req.params.id);
        if (!postShare) {
            return res.status(404).json({ message: 'Post Share not found' });
        }
        res.status(200).json({ message: 'Post Share deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
