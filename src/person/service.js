const { v4 } = require("uuid");
const data = require("../db");

function getPersons() {
  return new Promise((resolve) => resolve(data));
}

function getPerson(id) {
  return new Promise((resolve, reject) => {
    const person = data.find((person) => person.id === id);

    if (!person) {
      reject(new Error(`Person for ${id} wasn't found`));
    }

    resolve(person);
  });
}

function createPerson(person) {
  return new Promise((resolve) => {
    const newPerson = {
      id: v4(),
      ...person,
    };

    data.push(newPerson);

    resolve(newPerson);
  });
}

function deletePerson(id) {
  return new Promise((resolve, reject) => {
    const person = data.find((person) => person.id === id);

    if (!person) {
      reject(`No person with ${id} found`);
    }

    data = data.filter((person) => person.id !== id);

    resolve(person);
  });
}

function updatePerson(id, person) {
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
}

module.exports = {
  getPersons,
  getPerson,
  createPerson,
  deletePerson,
  updatePerson,
};
