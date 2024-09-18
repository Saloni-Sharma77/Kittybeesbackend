const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  phoneNumber: { 
    type: String, 
    required: true,
    unique: true  // Ensure phone number is unique in the collection
  },
  otp: { 
    type: String, 
    required: true 
  },
  otpExpiresAt: { 
    type: Date, 
    required: true 
  },
  otpTransactionId: { 
    type: String  // Optional: If your OTP provider returns a transaction ID for validation
  }
}, { timestamps: true });

module.exports = mongoose.model('Otp', otpSchema);
