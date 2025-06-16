const PostTag = require('../../schema/postTagSchema');

// Create new post tag
exports.createPostTag = async (req, res) => {
    try {
        const { name, isActive,createdBy,updatedBy } = req.body;
        const newPostTag = new PostTag({ name, isActive,createdBy,updatedBy });
        await newPostTag.save();
        res.status(201).json(newPostTag);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all post tags
exports.getAllPostTags = async (req, res) => {
    try {
        const postTags = await PostTag.find().populate('createdBy','fullname').populate('updatedBy','fullname');
        res.status(200).json(postTags);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get post tag by ID
exports.getPostTagById = async (req, res) => {
    try {
        const postTag = await PostTag.findById(req.params.id);
        if (!postTag) {
            return res.status(404).json({ message: 'Post tag not found' });
        }
        res.status(200).json(postTag);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update post tag by ID
exports.updatePostTag = async (req, res) => {
    try {
        const { name, isActive,createdBy,updatedBy  } = req.body;
        const updatedPostTag = await PostTag.findByIdAndUpdate(
            req.params.id,
            { name, isActive,createdBy,updatedBy  },
            { new: true }
        );
        if (!updatedPostTag) {
            return res.status(404).json({ message: 'Post tag not found' });
        }
        res.status(200).json(updatedPostTag);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete post tag by ID
exports.deletePostTag = async (req, res) => {
    try {
        const deletedPostTag = await PostTag.findByIdAndDelete(req.params.id);
        if (!deletedPostTag) {
            return res.status(404).json({ message: 'Post tag not found' });
        }
        res.status(200).json({ message: 'Post tag deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
