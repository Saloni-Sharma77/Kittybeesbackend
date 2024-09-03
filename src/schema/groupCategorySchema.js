const mongoose = require('mongoose');

const groupCategorySchema = new mongoose.Schema({
    name :{type:String,
        unique: true, // Ensure the name is unique
        trim: true
    },
    isActive:{type:Boolean,default : true},
},{timestamps:true} );

module.exports = mongoose.model('groupcategory', groupCategorySchema);
