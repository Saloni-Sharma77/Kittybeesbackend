// controllers/requesttojoingroupcontrollers.js
const RequestToJoinGroup = require('../../schema/requesttojoingroupSchema');
const Group = require('../../schema/groupSchema'); // Group schema

// Create a new request to join the group and add the user to the group
exports.createJoinRequest = async (req, res) => {
    try {
        const { groupId, userId } = req.body;

        // Check if the group exists
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Check if the user is already in the group
        if (group.userIds.includes(userId)) {
            return res.status(400).json({ message: 'User is already a member of the group' });
        }

        // Check if a join request already exists for this user and group
        const existingRequest = await RequestToJoinGroup.findOne({ groupId, userId });
        if (existingRequest) {
            return res.status(400).json({ message: 'Join request already exists for this user and group' });
        }

        // Create a new join request
        const joinRequest = new RequestToJoinGroup({ groupId, userId });
        await joinRequest.save();

        // Optionally, you may or may not want to add the user to the group's userIds array
        // Uncomment the following lines if you want to add the user to the group immediately
        // group.userIds.push(userId);
        // await group.save();

        res.status(201).json({
            message: 'Join request created',
            joinRequest,
            group
        });
    } catch (error) {
        res.status(500).json({ message: 'Error processing join request', error });
    }
};

// Fetch all join requests (Optional)
exports.getAllJoinRequests = async (req, res) => {
    try {
        const joinRequests = await RequestToJoinGroup.find().populate('groupId').populate('userId');
        res.status(200).json(joinRequests);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching join requests', error });
    }
};

// Fetch a single join request by ID
exports.getJoinRequestById = async (req, res) => {
    try {
        const joinRequest = await RequestToJoinGroup.findById(req.params.id).populate('groupId').populate('userId');
        if (!joinRequest) {
            return res.status(404).json({ message: 'Join request not found' });
        }
        res.status(200).json(joinRequest);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching join request', error });
    }
};

// Delete a join request
exports.deleteJoinRequest = async (req, res) => {
    try {
        const joinRequest = await RequestToJoinGroup.findByIdAndDelete(req.params.id);
        if (!joinRequest) {
            return res.status(404).json({ message: 'Join request not found' });
        }
        res.status(200).json({ message: 'Join request deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting join request', error });
    }
};
