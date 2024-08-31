const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema(
  {
    name: { type: String },
    groupIcon: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },

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
    image: { type: String },
    contributionAmount: { type: String },
    groupMembers: { type: String },
    isActive:{type:Boolean,default : true},
    // interests: {  type: [String], default: []},
    // GroupStatus: {type: String,enum: ['JoiniSatus', 'Requested'],required: true },

  },
  { timestamps: true }
);

module.exports = mongoose.model("groups", GroupSchema);
