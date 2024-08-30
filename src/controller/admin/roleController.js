const RoleModel = require('../../schema/roleSchema');

// Get all roles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await RoleModel.find();
    res.status(200).json(roles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new role
exports.addRoles = async (req, res) => {
  try {
    const newRole = new RoleModel(req.body);
    const savedRole = await newRole.save();
    res.status(201).json(savedRole);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get a role by ID
exports.getRolesById = async (req, res) => {
  try {
    const role = await RoleModel.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.status(200).json(role);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a role by ID
exports.updateRoles = async (req, res) => {
  try {
    const updatedRole = await RoleModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRole) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.status(200).json(updatedRole);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a role by ID
exports.deleteRoles = async (req, res) => {
  try {
    const deletedRole = await RoleModel.findByIdAndDelete(req.params.id);
    if (!deletedRole) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.status(200).json({ message: 'Role deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
