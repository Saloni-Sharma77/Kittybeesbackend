
const mongoose = require('mongoose');

const KittySchema = new mongoose.Schema({
    name :{type:String},
    groupId: [{ type: mongoose.Schema.Types.ObjectId, ref: "groups" }],
    userId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],

    isActive:{type:Boolean,default : true},

},{timestamps:true} );

module.exports = mongoose.model('Kitty', KittySchema);
