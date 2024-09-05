
const mongoose = require('mongoose');
const optionSchema = new mongoose.Schema({
    text: { type: String },
    votes: { type: Number, default: 0 }
  });
  
  // Define the schema for polls
  const pollSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: [optionSchema]
  });
  

const postSchema = new mongoose.Schema({
    name :{type:String},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    description:{type:String},
    image: { type: String },
    isActive:{type:Boolean,default : true},
    poll: pollSchema // Add the poll field to the schema


},{timestamps:true} );

module.exports = mongoose.model('post', postSchema);
