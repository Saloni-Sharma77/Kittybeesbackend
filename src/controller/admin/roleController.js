// roleController.js

const RoleModel = require('../../schema/roleSchema');
const UserModel = require('../../schema/userSchema');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// Get all roles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await RoleModel.find().populate('permissions.page').populate('userId'); // Populate pages
    res.status(200).json(roles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new role
exports.addRoles = async (req, res) => {
  const { roles, permissions ,userId,password} = req.body;
  for (let permission of permissions) {
    if (!permission.page || !Array.isArray(permission.actions)) {
      return res.status(400).json({ message: 'Invalid permission structure.' });
    }
  }
  // Proceed with saving the role
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // 10 rounds of salt (adjust as needed)

    // Update the user's password
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId, 
      { password: hashedPassword },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const newRole = new RoleModel({ roles, permissions ,userId,password});

    await newRole.save();
    res.status(201).json({ message: 'Role added successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving role.', error: error.message });
  }
};

// Get a role by ID
exports.getRolesById = async (req, res) => {
  try {
    const role = await RoleModel.findById(req.params.id).populate('permissions.page');
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
  const { roles, permissions,userId,password } = req.body;


  // Check each permission
  for (let permission of permissions) {
    if (!permission.page || !Array.isArray(permission.actions)) {
      return res.status(400).json({ message: 'Invalid permission structure.' });
    }
  }

  try {
    const updatedRole = await RoleModel.findByIdAndUpdate(req.params.id, { roles, permissions,userId,password }, {
      new: true,
      runValidators: true,
    });

    if (!updatedRole) {
      return res.status(404).json({ message: 'Role not found' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // 10 rounds of salt (adjust as needed)

    // Update the user's password
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId, 
      { password: hashedPassword },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json(updatedRole);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

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
