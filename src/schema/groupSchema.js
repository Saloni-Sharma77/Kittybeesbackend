const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema(
  {
    name: { type: String },
    groupIcon: { type: String },
    userIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
    groupType: {
      type: String,
      enum: ["private", "public"],
      default: "private",
    },
    description: { type: String },
    rulesAndRegulation: { type: String },
    kittyFrequency: { type: String },
    groupCityArea: { type: String },
    contributionAmount: { type: String },
    groupMembers: { type: String },
    isActive:{type:Boolean,default : true},
  },
  { timestamps: true }
);

module.exports = mongoose.model("groups", GroupSchema);
