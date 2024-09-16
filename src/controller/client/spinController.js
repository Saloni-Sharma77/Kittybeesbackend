const Group = require('../../schema/groupSchema'); // Ensure path is correct
const Spin = require('../../schema/spinSchema'); // Ensure path is correct
const Users = require('../../schema/userSchema'); // Ensure path is correct

const spinKitty = async (req, res) => {
  try {
    const { groupId } = req.params;

    // Find the group
    const group = await Group.findById(groupId);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Fetch users from the userIds array in the group
    let users = group.userIds.filter(user => user.status === 'approved');

    if (users.length === 0) {
      return res.status(400).json({ message: 'No approved users available to spin' });
    }

    // Find existing spin record or create a new one
    let spin = await Spin.findOne({ groupId });
    if (!spin) {
      spin = new Spin({ groupId, users: [] });
    }

    // Flatten the list of spun users
    const spunUserIds = spin.users.map(user => user.userId.toString());

    // Filter out users who have already been spun
    let availableUsers = users.filter(user => !spunUserIds.includes(user.userId.toString()));

    // Prepare spin results array
    let spinResults = [];

    // Function to get users for spin and add to results
    const performSpin = () => {
      if (availableUsers.length < 6) {
        if (availableUsers.length === 0) {
          return res.status(400).json({ message: 'No more users available for spinning' });
        }

        // Shuffle the array and pick available users
        availableUsers = availableUsers.sort(() => Math.random() - 0.5);

        // Add results with padding if needed
        while (spinResults.length < 6) {
          spinResults.push({
            userId: availableUsers.length > 0 ? availableUsers.shift().userId : null,
            number: spinResults.length + 1
          });
        }
      } else {
        // Shuffle the array and pick 6 users
        availableUsers = availableUsers.sort(() => Math.random() - 0.5).slice(0, 6);

        spinResults = availableUsers.map((user, index) => ({
          userId: user.userId,
          number: index + 1
        }));
      }
    };

    // Perform spins and update spin results
    for (let i = 0; i < 6; i++) {
      performSpin();

      // Filter out dummy values (nulls) from the results
      const validResults = spinResults.filter(result => result.userId !== null);

      if (validResults.length > 0) {
        spin.users = spin.users.concat(validResults);
        await spin.save();
        spinResults = []; // Reset for next spin
      }
      
      // Update available users list
      availableUsers = users.filter(user => !spunUserIds.includes(user.userId.toString()));
    }

    if (spin.users.length === 0) {
      return res.status(400).json({ message: 'No users could be spun' });
    }

    res.status(200).json({ message: 'Spin completed successfully', spin });
  } catch (error) {
    console.error('Error in spinKitty:', error); // Log error details
    res.status(500).json({ message: 'An error occurred while spinning the kitty', error: error.message });
  }
};

const getGroupById = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId).populate('userIds.userId');
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.status(200).json(group);
  } catch (error) {
    console.error('Error in getGroupById:', error); // Log error details
    res.status(500).json({ message: 'An error occurred while fetching the group', error: error.message });
  }
};

module.exports = { spinKitty, getGroupById };
