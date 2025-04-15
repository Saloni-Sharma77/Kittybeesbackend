const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  contacts: [
    {
      name: {
        type: String,
        required: true,
      },
      number: {
        type: String,
        required: true,
      },
    },
  ],
  uid: { 
    type: String,
    required: true, 
  },
});

module.exports = mongoose.model("Contact", contactSchema);
