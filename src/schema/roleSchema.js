const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
  page: { type: String, required: true },
  actions: [{ type: String }]
});

const RoleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  permissions: [PermissionSchema]
});

module.exports = mongoose.model('Role', RoleSchema);
