const mongoose = require('mongoose');

const termsAndServicesSchema = new mongoose.Schema({
  termsAndServices: {
    type: String,
    required: true,
  },

     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
},{timestamps:true});

const TermsAndServices = mongoose.model('TermsAndServices', termsAndServicesSchema);

module.exports = TermsAndServices;
