
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    name :{type:String},
    userId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
    description:{type:String},
    image: { type: String },
    isActive:{type:Boolean,default : true},

},{timestamps:true} );

module.exports = mongoose.model('post', postSchema);
