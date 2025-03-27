const Contact = require("../../schema/contactsSchema");

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
