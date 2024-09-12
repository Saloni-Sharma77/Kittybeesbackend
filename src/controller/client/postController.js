const PostModel = require("../../schema/postSchema");
// Add a new post
exports.addPost = async (req, res) => {
  try {
    const { name, userId, description, image, isActive, poll } = req.body;

    // Create a new post
    const newPost = new PostModel({
      name,
      userId,
      description,
      image,
      isActive,
      poll // Add the poll data here
    });

    // Save the post to the database
    await newPost.save();

    res.status(201).json({ message: 'Post created successfully', data: newPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.voteForPost = async (req, res) => {
  try {
    const { postId, optionId, userId } = req.body; // Include userId to track who voted

    // Find the post by ID
    const post = await PostModel.findById(postId);

    if (!post || !post.poll) {
      return res.status(404).json({ message: 'Post or poll not found' });
    }

    // Find the option by ID
    const option = post.poll.options.id(optionId);
    if (!option) {
      return res.status(404).json({ message: 'Option not found' });
    }

    // Check if the user has already voted for this option
    const hasVotedIndex = option.voters.findIndex(voter => voter.toString() === userId); // Ensure string comparison

    if (hasVotedIndex !== -1) {
      // If the user has already voted, remove their vote
      option.votes -= 1;
      option.voters.splice(hasVotedIndex, 1); // Remove the user from voters array
    } else {
      // If the user hasn't voted, add their vote
      option.votes += 1;
      option.voters.push(userId); // Add userId to voters array
    }

    // Save the updated post
    await post.save();

    res.status(200).json({ message: 'Vote updated successfully', post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// Like or Unlike a Post
exports.toggleLike = async (req, res) => {
  try {
    const { postId, userId } = req.body;

    // Find the post by ID
    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the user has already liked the post
    const likeIndex = post.likes.findIndex(like => like.toString() === userId);

    if (likeIndex !== -1) {
      // User has already liked the post, so unlike (remove the like)
      post.likes.splice(likeIndex, 1);
    } else {
      // User has not liked the post yet, so add the like
      post.likes.push(userId);
    }

    // Save the updated post
    await post.save();

    res.status(200).json({ message: 'Like status updated successfully', post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Add a comment to a post
exports.addComment = async (req, res) => {
  try {
    const { postId, userId, text } = req.body;

    // Find the post by ID
    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Add the new comment to the post
    post.comments.push({ userId, text });

    // Save the updated post
    await post.save();

    res.status(200).json({ message: 'Comment added successfully', post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getAllComments = async (req,res) =>{
  try {
    const {postId} = req.body
    const post = await PostModel.findById(postId)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const comments = post.comments;
    res.status(200).json({ message: 'All commentes fetched successfully', data: comments });

  } catch (error) {
    console.error(err);
    res.status(500).json({ message: 'Error in fetching all comments' });
  }
}

// Delete a comment from a post
exports.deleteComment = async (req, res) => {
  try {
    const { postId, commentId, userId } = req.body;

    // Find the post by ID
    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Find the comment and check if the user is the owner of the comment
    const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId && comment.userId.toString() === userId);

    if (commentIndex === -1) {
      return res.status(403).json({ message: 'Comment not found or you do not have permission to delete this comment' });
    }

    // Remove the comment from the comments array
    post.comments.splice(commentIndex, 1);

    // Save the updated post
    await post.save();

    res.status(200).json({ message: 'Comment deleted successfully', post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


  // Get all posts
exports.getAllPost = async (req, res) => {
    try {
      const { description } = req.query; // Get the search term from the query parameters

      const query = description ? { description: { $regex: description, $options: "i" } } : {};
      // Fetch all posts, populate userId with user information
      const posts = await PostModel.find(query).populate('userId').sort({ createdAt: -1 });
  
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
  

  exports.addReply = async (req, res) => {
    try {
      const { postId, commentId, userId, text } = req.body;
  
      if (!postId || !commentId || !userId || !text) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      const post = await PostModel.findById(postId);
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      const comment = post.comments.id(commentId);
  
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      comment.replies.push({
        userId: userId,
        text: text,
        createdAt: new Date()
      });
  
      await post.save();
  
      res.status(200).json({
        message: 'Reply added successfully',
        post
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };