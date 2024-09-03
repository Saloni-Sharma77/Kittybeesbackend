const PostModel = require("../../schema/postSchema");
// Add a new post
exports.addPost = async (req, res) => {
    try {
      const { name, userId, description, image, isActive } = req.body;
  
      // Create a new post
      const newPost = new PostModel({
        name,
        userId,
        description,
        image,
        isActive
      });
  
      // Save the post to the database
      await newPost.save();
  
      res.status(201).json({ message: 'Post created successfully', data: newPost });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  // Get all posts
exports.getAllPost = async (req, res) => {
    try {
      // Fetch all posts, populate userId with user information
      const posts = await PostModel.find().populate('userId');
  
      res.status(200).json({ message: 'All posts fetched successfully', data: posts });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  // Get all posts by user ID
exports.getAllPostByme = async (req, res) => {
    try {
      const userId = req.params.id;
  
      // Fetch posts by userId
      const posts = await PostModel.find({ userId }).populate('userId');
  
      res.status(200).json({ message: 'Posts by user fetched successfully', data: posts });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  // Get a single post by post ID
exports.getPostById = async (req, res) => {
    try {
      const postId = req.params.id;
  
      // Find post by ID
      const post = await PostModel.findById(postId).populate('userId');
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      res.status(200).json({ message: 'Post fetched successfully', data: post });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  // Update a post by post ID
exports.updatePostById = async (req, res) => {
    try {
      const postId = req.params.id;
      const updateData = req.body;
  
      // Find post by ID and update it
      const updatedPost = await PostModel.findByIdAndUpdate(postId, updateData, {
        new: true, // return the updated document
        runValidators: true, // run schema validation
      });
  
      if (!updatedPost) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      res.status(200).json({ message: 'Post updated successfully', data: updatedPost });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  // Delete a post by post ID
exports.deletePostById = async (req, res) => {
    try {
      const postId = req.params.id;
  
      // Find post by ID and delete it
      const deletedPost = await PostModel.findByIdAndDelete(postId);
  
      if (!deletedPost) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      res.status(200).json({ message: 'Post deleted successfully', data: deletedPost });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  