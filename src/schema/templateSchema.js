const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
  isActive:{type:Boolean,default : true},

});

module.exports = mongoose.model('Template', TemplateSchema);
