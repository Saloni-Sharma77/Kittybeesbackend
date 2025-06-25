require('dotenv').config({ path: __dirname + '/../../../.env' });

const mongoose = require('../../config/db');
const Contact = require("../../schema/contactsSchema");
const { faker } = require('@faker-js/faker');

(async () => {
  try {
    console.log("Starting insertion...");
    console.log("MONGODB_URL:", process.env.MONGODB_URL);

    const userId = "68300d42cbbfe4bbdd575c76"; 
    const uid = "UP1A.231005.007";

    const contacts = [];
    for (let i = 1; i <= 4000; i++) {
      contacts.push({
        name: faker.person.fullName(),
        number: faker.phone.number('##########')
      });
    }

    const existing = await Contact.findOne({ userId, uid });

    if (!existing) {
      console.log("Inserting new contact list...");
      const newContactList = new Contact({
        userId,
        uid,
        contacts
      });
      await newContactList.save();
    } else {
      console.log("User already has contacts, updating...");
      existing.contacts = contacts;
      await existing.save();
    }

    console.log("Dummy data inserted successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error inserting dummy data:", error);
    process.exit(1);
  }
})();
