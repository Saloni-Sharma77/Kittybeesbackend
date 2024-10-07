// const mongoose = require('mongoose');

// const PermissionSchema = new mongoose.Schema({
//   page: { type: String, required: true },
//   actions: [{ type: String }]
// });

// const RoleSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   permissions: [PermissionSchema]
// });

// module.exports = mongoose.model('Role', RoleSchema);



const mongoose = require('mongoose');

// Permissions Schema
const PermissionSchema = new mongoose.Schema({
  page: { type: mongoose.Schema.Types.ObjectId, ref: 'Page', required: true }, // Reference the fixed page
  actions: { type: [String], default: [] } // Array of actions for that page
}, { _id: false }); // Disable _id for the embedded document

// Role Schema
const RoleSchema = new mongoose.Schema({
  roles: { type: String, required: true }, // Allow multiple roles as an array
  permissions: [PermissionSchema] ,// Permissions with fixed page reference
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  password: { type: String},

}, { timestamps: true }); // Automatically manage createdAt and updatedAt

module.exports = mongoose.model('Role', RoleSchema);
