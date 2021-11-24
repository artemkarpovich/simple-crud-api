const { randomUUID } = require("crypto");

let persons = [
  {
    id: randomUUID(),
    name: "Vasya",
    age: 18,
    hobbies: ["football", "playing table game"],
  },
  {
    id: randomUUID(),
    name: "Lisa",
    age: 27,
    hobbies: ["travelling", "cooking"],
  },
];

module.exports = persons;
