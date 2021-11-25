const { ValidationError } = require("../errors");

function validateBody(body) {
  const bodyKeys = Object.keys(body);

  if (bodyKeys.length === 0) {
    throw new ValidationError("Body is empty");
  } else if (bodyKeys.includes("name") && typeof body.name !== "string") {
    throw new ValidationError("Name should be a string type");
  } else if (!body.name) {
    throw new ValidationError("Name is a required field");
  } else if (bodyKeys.includes("age") && typeof body.age !== "number") {
    throw new ValidationError("Age should be a number type");
  } else if (!body.age) {
    throw new ValidationError("Age is a required field");
  } else if (bodyKeys.includes("hobbies") && !Array.isArray(body.hobbies)) {
    throw new ValidationError("Hobbies should be an array of string");
  } else if (!body.hobbies) {
    throw new ValidationError("Hobbies is a required field");
  } else if (body.hobbies && !body.hobbies.every((hobby) => typeof hobby === "string")) {
    throw new ValidationError("Hobby should be a string type");
  }
}

module.exports = validateBody;
