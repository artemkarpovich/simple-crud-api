const { randomUUID } = require("crypto");
const data = require("../db");

const personService = {
  getPersons() {
    return new Promise((resolve) => resolve(data));
  },

  getPerson(id) {
    return new Promise((resolve, reject) => {
      const person = data.find((person) => person.id === id);

      if (!person) {
        reject(`Person for ${id} wasn't found`);
      }

      resolve(person);
    });
  },

  createPerson(person) {
    return new Promise((resolve) => {
      const newPerson = {
        id: randomUUID(),
        ...person,
      };

      data.push(newPerson);

      resolve(newPerson);
    });
  },

  deletePerson(id) {
    return new Promise((resolve, reject) => {
      const person = data.find((person) => person.id === id);

      if (!person) {
        reject(`No person with ${id} found`);
      }

      data = data.filter((person) => person.id !== id);

      resolve(person);
    });
  },

  updatePerson(id, person) {
    return new Promise((resolve, reject) => {
      const person = data.find((person) => person.id === id);

      const fullPerson = { id, ...person };

      if (!person) {
        reject(`No person with ${id} found`);
      }

      const personIndex = data.findIndex((person) => person.id === id);

      data = [...data.slice(0, personIndex), fullPerson, ...data.slice(personIndex + 1)];

      resolve(fullPerson);
    });
  },
};

module.exports = personService;
