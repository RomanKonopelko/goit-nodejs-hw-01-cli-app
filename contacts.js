const fs = require("fs/promises");
const path = require("path");
const contactsPath = path.join(__dirname, "db", "contacts.json");
const { v4: uuidv4 } = require("uuid");

const randomId = uuidv4();

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const parsedData = await JSON.parse(data);
    const table = await console.table(parsedData);
    return table;
  } catch (err) {
    console.error(err.message);
  }
}

async function getContactById(contactId) {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const parsedData = await JSON.parse(data);
    const filteredContact = parsedData.filter((contact) => String(contact.id) === contactId);
    filteredContact.length > 0
      ? console.table(filteredContact)
      : console.warn(`\x1B[31m Couldn't find the contact with such ID`);
  } catch (err) {
    console.error(err);
  }
}

async function removeContact(contactId) {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const parsedData = await JSON.parse(data);
    const isContactPresent = parsedData.find((contact) => String(contact.id) === contactId);

    if (!isContactPresent) return console.warn("\x1B[31m There is no contact with given ID");

    const deletedContact = parsedData.filter((contact) => String(contact.id) !== contactId);

    await fs.writeFile(contactsPath, JSON.stringify(deletedContact, null, 2));

    console.log(`\x1b[32m Contact with id:${contactId} has been removed!`);
  } catch (err) {
    console.error(err);
  }
}

async function addContact(name, email, phone) {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const parsedData = await JSON.parse(data);
    const newContact = [{ id: randomId, name, email, phone }];
    const isContactPresent = parsedData.find(
      (contact) => contact.email === newContact[0].email || contact.phone === newContact[0].phone
    );

    if (isContactPresent) return console.warn("\x1B[31m Contact with such number or email already exist!");

    const newContactsArr = [...parsedData, ...newContact];

    await fs.writeFile(contactsPath, JSON.stringify(newContactsArr, null, 2));

    console.log(`\x1b[32m Contact ${name} has been added successfully!`);
  } catch (err) {
    console.error(err);
  }
}

module.exports = { listContacts, getContactById, removeContact, addContact };
