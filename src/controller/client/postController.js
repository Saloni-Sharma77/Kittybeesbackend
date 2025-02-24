const PostModel = require("../../schema/postSchema");
const UserModel = require("../../schema/userSchema");
const NotificationSchema = require("../../schema/notificationSchema"); // Import Notification model
const { sendPostCreatedNotifications } = require('../../PushNotification/pushNotification');

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
    //notification work starts here
    const allActiveUsers = await UserModel.find({ isActive: true,
      communityReminder: true,
      _id: { $ne: userId } });

    // Create notifications for all active users
    const notifications = allActiveUsers.map(user => ({
      userId: user._id,
      postId: newPost._id,
      message: `A new post has been created. Check it out!`,
      type: 'post',
    }));

    // Add a notification for the post creator
    const creatorNotification = {
      userId, // Post creator's userId
      postId: newPost._id,
      message: `You have successfully created the post`,
      type: 'post',
    };

    // Combine notifications
    notifications.push(creatorNotification);

    // Insert all notifications into the database
    await NotificationSchema.insertMany(notifications);

    const notificationMessage = `A new post has been created. Check it out!`;
    await sendPostCreatedNotifications({
      title: 'New Post Alert!',
      message: notificationMessage,
      postId: newPost._id,
      userIds: allActiveUsers.map(user => user._id),
    });
    res.status(201).json({ message: 'Post created successfully', data: newPost });
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
    const user = await UserModel.findById(userId);


    // Check if the user has already liked the post
    const likeIndex = post.likes.findIndex(like => like?.toString() === userId);

    if (likeIndex !== -1) {
      // User has already liked the post, so unlike (remove the like)
      post.likes.splice(likeIndex, 1);
    } else {
      // User has not liked the post yet, so add the like
      post.likes.push(userId);
    }

    // Save the updated post
    await post.save();
 // Determine if the user is liking or unliking
    const isLiked = likeIndex === -1;

    // Notification message based on the action
    const action = isLiked ? 'liked' : 'disliked';
    const notificationMessage = `${user.fullName} ${action} your post.`;

    // Notification for the post creator
    const creatorNotification = {
      userId: post.userId, // Post creator's userId
      postId: postId,
      message: notificationMessage,
      type: 'post',
      createdBy: userId,
    };

    // Insert the notification for the post creator
    await NotificationSchema.create(creatorNotification);

    // Notify all active users (excluding the user who performed the action)
    const allActiveUsers = await UserModel.find({
      isActive: true,
      communityReminder: true,
      _id: { $ne: userId },
    });

    const generalNotificationMessage = `${user?.fullname} ${action} a post. Check it out!`;

    const notifications = allActiveUsers.map(activeUser => ({
      userId: activeUser._id,
      postId: postId,
      message: generalNotificationMessage,
      type: 'post',
      createdBy: userId,
    }));

    // Insert notifications for all active users
    await NotificationSchema.insertMany(notifications);

    await sendPostCreatedNotifications({
      title: 'Post Alert!',
      message: generalNotificationMessage,
      postId: post._id,
      userIds: allActiveUsers.map(user => user._id),
    });

    res.status(200).json({ message: 'Like status updated successfully', post });
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

    let previousOption = null;

    // Find if the user has already voted for any option
    post.poll.options.forEach(option => {
      if (option.voters.some(voter => voter.toString() === userId)) {
        previousOption = option;
      }
    });

    // If the user previously voted, remove their vote from the old option
    if (previousOption) {
      previousOption.votes -= 1;
      previousOption.voters = previousOption.voters.filter(
        voter => voter.toString() !== userId
      );
    }

    // Find the new option and add the user's vote
    const newOption = post.poll.options.id(optionId);
    if (!newOption) {
      return res.status(404).json({ message: 'Option not found' });
    }

    newOption.votes += 1;
    newOption.voters.push(userId);

    // Save the updated post
    await post.save();

    res.status(200).json({ message: 'Vote updated successfully', post });
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
      const { fullname, page = 1, limit = 10 } = req.query; // Get search term, page, and limit from query parameters
  
      const matchStage = fullname
        ? { 'userId.fullname': { $regex: fullname, $options: 'i' } }
        : {};
  
      const skip = (parseInt(page) - 1) * parseInt(limit); // Calculate the number of documents to skip
  
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
        {
          $skip: skip, // Skip documents based on the current page
        },
        {
          $limit: parseInt(limit), // Limit the number of documents per page
        },
      ]);
  
      const totalPosts = await PostModel.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userId',
          },
        },
        {
          $unwind: '$userId',
        },
        {
          $match: matchStage,
        },
        {
          $count: 'totalCount', // Count the total number of matching posts
        },
      ]);
  
      const totalCount = totalPosts[0]?.totalCount || 0; // Handle cases where no posts match
  
      res.status(200).json({
        message: 'All posts fetched successfully',
        data: posts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          totalItems: totalCount,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  

  exports.getPostByTag = async (req, res) => {
    try {
      const { postTagId } = req.query; // Extract postTagId from query parameters
  
 
  
      // Find posts matching the provided postTagId
      const posts = await PostModel.find({ postTagId }).populate("userId");
  
      if (!posts || posts.length === 0) {
        return res.status(404).json({ message: "No posts found for the given tag" });
      }
  
      res.status(200).json({
        message: "Posts retrieved successfully",
        data: posts,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to retrieve posts",
        error: error.message,
      });
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
      let post = await PostModel.findById(postId).populate('userId');
      let postObj = post?.toObject();

     delete postObj.postTagId
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      res.status(200).json({ message: 'Post fetched successfully', data: postObj });
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