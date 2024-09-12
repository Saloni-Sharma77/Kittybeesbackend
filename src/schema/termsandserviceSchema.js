const mongoose = require('mongoose');

const termsAndServicesSchema = new mongoose.Schema({
  termsAndServices: {
    type: String,
    required: true,
  },
});

const TermsAndServices = mongoose.model('TermsAndServices', termsAndServicesSchema);

module.exports = TermsAndServices;
