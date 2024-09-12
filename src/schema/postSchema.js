const mongoose = require('mongoose');

// Define the schema for replies
const replySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true }, // User who made the reply
  text: { type: String, required: true }, // Reply text
  createdAt: { type: Date, default: Date.now } // Timestamp
});

// Define the schema for comments
const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  }, // User who made the comment
  text: { type: String, required: true }, // Comment text
  replies: [replySchema], // Array of replies
  createdAt: { type: Date, default: Date.now } // Timestamp
});

// Define the schema for poll options
const optionSchema = new mongoose.Schema({
  text: { type: String },
  votes: { type: Number, default: 0 },
  voters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }], // Track users who voted for this option
});

// Define the schema for polls
const pollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [optionSchema],
});

// Define the schema for posts
const postSchema = new mongoose.Schema(
  {
    name: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    description: { type: String },
    image: { type: String },
    isActive: { type: Boolean, default: true },
    poll: pollSchema, // Poll field
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }], // Array of users who liked the post
    comments: [commentSchema], // Array of comments
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
