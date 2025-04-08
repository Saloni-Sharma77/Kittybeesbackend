const Contact = require("../../schema/contactsSchema");
const mongoose = require("mongoose");
const User = require("../../schema/userSchema");

// Create a new contact list for a user
exports.createContactList = async (req, res) => {
  try {
    const { userId, contacts } = req.body;
    const newContactList = new Contact({ userId, contacts });
    await newContactList.save();
    res.status(201).json({ message: "Contact list created successfully", data: newContactList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a contact to the user's contact list
exports.addContact = async (req, res) => {
  try {
    const { userId, name, number } = req.body;
    const contactList = await Contact.findOne({ userId });

    if (!contactList) {
      return res.status(404).json({ message: "Contact list not found" });
    }

    contactList.contacts.push({ name, number });
    await contactList.save();

    res.status(200).json({ message: "Contact added successfully", data: contactList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get contacts by user ID
exports.getContactsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const contactList = await Contact.findOne({ userId });

    if (!contactList) {
      return res.status(404).json({ message: "No contacts found" });
    }

    res.status(200).json({ data: contactList.contacts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a contact by ID
exports.deleteContact = async (req, res) => {
  try {
    const { userId, contactId } = req.body;
    const contactList = await Contact.findOne({ userId });

    if (!contactList) {
      return res.status(404).json({ message: "Contact list not found" });
    }

    contactList.contacts = contactList.contacts.filter(contact => contact._id.toString() !== contactId);
    await contactList.save();

    res.status(200).json({ message: "Contact deleted successfully", data: contactList.contacts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





exports.getCommonContacts = async (req, res) => {
  try {
    // Get all contacts
    const allContacts = await Contact.find({}).lean();

    if (allContacts.length === 0) {
      return res.status(404).json({ message: "No contacts found." });
    }

    // Collect all numbers from all contacts
    const allNumbers = allContacts.flatMap(contact =>
      contact.contacts.map(c => c.number)
    );

    // Find users where phoneNumber matches contact number
    const matchedUsers = await User.find({ phoneNumber: { $in: allNumbers } }).lean();

    if (matchedUsers.length === 0) {
      return res.status(404).json({ message: "No common contacts found." });
    }

    // Prepare response data
    const commonContacts = [];

    allContacts.forEach(contactDoc => {
      contactDoc.contacts.forEach(contact => {
        const userData = matchedUsers.find(user => user.phoneNumber === contact.number);
        if (userData) {
          commonContacts.push({
            contactName: contact.name,
            contactNumber: contact.number,
            userDetails: {
              userId: userData._id,
              fullname: userData.fullname,
              phoneNumber: userData.phoneNumber,
              image: userData.profileImage,
            },
          });
        }
      });
    });

    return res.status(200).json({
      message: "Common contacts fetched successfully",
      commonContacts,
    });

  } catch (error) {
    console.error("Error fetching common contacts:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};





exports.searchUserContacts = async (req, res) => {
  try {
    const { userId, search } = req.query;

    if (!userId || !search) {
      return res.status(400).json({ message: "userId & search is required" });
    }

    const contactsData = await Contact.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) },
      },
      {
        $project: {
          contacts: {
            $filter: {
              input: "$contacts",
              as: "contact",
              cond: {
                $or: [
                  {
                    $regexMatch: {
                      input: "$$contact.name",
                      regex: search,
                      options: "i",
                    },
                  },
                  {
                    $regexMatch: {
                      input: "$$contact.number",
                      regex: search,
                      options: "i",
                    },
                  },
                ],
              },
            },
          },
        },
      },
    ]);

    const contacts = contactsData.length ? contactsData[0].contacts : [];

    return res.status(200).json({
      message: "Contacts fetched successfully",
      total: contacts.length,
      contacts,
    });
  } catch (error) {
    console.error("Error searching contacts:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
