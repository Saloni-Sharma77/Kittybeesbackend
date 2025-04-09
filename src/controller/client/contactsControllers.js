const Contact = require("../../schema/contactsSchema");
const mongoose = require("mongoose");
const User = require("../../schema/userSchema");

// Create a new contact list for a user
// exports.createContactList = async (req, res) => {
//   try {
//     const { userId, contacts } = req.body;

//     const contactAlreadyExist = await Contact.findOne({ userId });

//     if (!contactAlreadyExist) {
//       const newContactList = new Contact({ userId, contacts });
//       await newContactList.save();
//       res.status(201).json({ message: "Contact list created successfully" });
//     }
//     return res.status(201).json({ message: "Contacts are already stored" });


//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.createContactList = async (req, res) => {
  try {
    const { userId, contacts } = req.body;

    const contactAlreadyExist = await Contact.findOne({ userId });

    if (!contactAlreadyExist) {

      // Remove duplicates based on name
      const uniqueContacts = contacts.filter(
        (contact, index, self) =>
          index === self.findIndex((c) => c.name.trim().toLowerCase() === contact.name.trim().toLowerCase())
      );

      const newContactList = new Contact({ userId, contacts: uniqueContacts });
      await newContactList.save();

      return res.status(201).json({ message: "Contact list created successfully" });
    }

    return res.status(200).json({ message: "Contacts are already stored" });

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
  const { page = 1, limit = 100} = req.query; // Get pagination, search term, and userId from the query parameters
  const skip = (parseInt(page) - 1) * parseInt(limit);
  try {
    const { userId } = req.params;
    const contactList = await Contact.findOne({ userId });
    const paginatedContacts = contactList.contacts.slice(skip, skip + parseInt(limit));

    if (!contactList) {
      return res.status(404).json({ message: "No contacts found" });
    }

    res.status(200).json({ data: paginatedContacts });
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
    const { userId } = req.query;
    const allContacts = await Contact.findOne({userId:userId}).lean();

    if (!allContacts ) {
      return res.status(404).json({ message: "No contacts found." });
    }


    // Find users where phoneNumber matches contact number
    const contactNumbers = allContacts.contacts.map(contact => contact.number);
    const matchedUsers = await User.find({
      phoneNumber: { $in: contactNumbers }
    })
    .select("fullname phoneNumber userId")
    .lean();
    
    if (!matchedUsers) {
      return res.status(404).json({ message: "No common contacts found." });
    }


    return res.status(200).json({
      message: "Common contacts fetched successfully",
      matchedUsers,
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
