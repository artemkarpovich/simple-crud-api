const { v4 } = require("uuid");

let persons = [
  {
    id: v4(),
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
