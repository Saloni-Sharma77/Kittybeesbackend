const PostModel = require("../../schema/postSchema");
// Add a new post
exports.addPost = async (req, res) => {
  try {
    const { name, userId, description, image, isActive, poll,postTagId ,anonymous} = req.body;

    // Create a new post
    const newPost = new PostModel({
      name,
      userId,
      description,
      image,
      postTagId,
      isActive,
      anonymous,
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

    // Check if the user has already voted for any option in the poll
    const alreadyVotedOption = post.poll.options.find(option =>
      option.voters.some(voter => voter.toString() === userId)
    );

    if (alreadyVotedOption) {
      if (alreadyVotedOption._id.toString() === optionId) {
        // User is trying to remove their vote from the current option
        alreadyVotedOption.votes -= 1;
        alreadyVotedOption.voters = alreadyVotedOption.voters.filter(
          voter => voter.toString() !== userId
        );
      } else {
        // User has voted for a different option
        return res.status(400).json({ message: 'You have already voted for another option' });
      }
    } else {
      // Find the option by ID
      const option = post.poll.options.id(optionId);
      if (!option) {
        return res.status(404).json({ message: 'Option not found' });
      }

      // Add the user's vote to the selected option
      option.votes += 1;
      option.voters.push(userId);
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


exports.getAllComments = async (req, res) => {
  try {
    const { postId } = req.body;

    // Validate postId
    if (!postId) {
      return res.status(400).json({ message: 'Post ID is required' });
    }

    // Fetch the post and populate the userId field
    const post = await PostModel.findById(postId)
    .populate('userId', 'name profileImage') // Populate user who created the post
    .populate({
      path: 'comments.userId', // Populate userId in comments
      select: 'fullname profileImage', // Select specific fields to return
    })
    .populate({
      path: 'comments.replies.userId', // Populate userId in replies
      select: 'fullname profileImage',
    });
      
    // Check if the post exists
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Fetch comments
    const comments = post.comments;

    res.status(200).json({
      message: 'All comments fetched successfully',
      data: comments,
    });
  } catch (error) {
    console.error(error); // Correct error logging
    res.status(500).json({ message: 'Error fetching comments', error: error.message });
  }
};


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
      const { fullname } = req.query; // Get the search term from the query parameters
  
      const matchStage = fullname
        ? { 'userId.fullname': { $regex: fullname, $options: 'i' } }
        : {};
  
      const posts = await PostModel.aggregate([
        {
          $lookup: {
            from: 'users', // The collection name of the User model
            localField: 'userId',
            foreignField: '_id',
            as: 'userId',
          },
        },
        {
          $unwind: '$userId', // Unwind the userId array to work with the object
        },
        {
          $match: matchStage, // Apply the search filter on the populated fullname field
        },
        {
          $sort: { createdAt: -1 }, // Sort by creation date
        },
      ]);
  
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
      const posts = await PostModel.find({ userId }).populate('userId').populate('postTagId');
  
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