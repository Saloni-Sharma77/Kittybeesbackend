const mongoose = require("mongoose");

const CustomThemeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, 
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const CustomTheme = mongoose.model("CustomTheme", CustomThemeSchema);

module.exports = CustomTheme;
