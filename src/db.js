const { v4 } = require("uuid");

let persons = [
  {
    id: "f40e70ae-eefc-48f9-93c4-b9dfc88a82fc",
    name: "Vasya",
    age: 18,
    hobbies: ["football", "playing table game"],
  },
  {
    id: v4(),
    name: "Lisa",
    age: 27,
    hobbies: ["travelling", "cooking"],
  },
];

module.exports = persons;
