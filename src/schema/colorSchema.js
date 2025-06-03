
const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
    name: { type: String ,unique:true},
    isActive:{type:Boolean,default : true},
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },

},{timestamps:true} );

module.exports = mongoose.model('color', colorSchema);
