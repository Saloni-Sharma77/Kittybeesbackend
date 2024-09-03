
const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    name :{type:String},
    userId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
    venueId: [{ type: mongoose.Schema.Types.ObjectId, ref: "venues" }],
    description:{type:String},
    image: { type: String },
    isActive:{type:Boolean,default : true},

},{timestamps:true} );

module.exports = mongoose.model('wishlist', wishlistSchema);
