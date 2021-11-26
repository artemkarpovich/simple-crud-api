const { validate } = require("uuid");
const { HTTP_STATUS_CODES } = require("../constants");
const { ValidationError } = require("../errors");
const {
  handleReqData,
  splitUrl,
  handleResponse,
  handleError,
} = require("../utils");
const personService = require("./service");
const validateBody = require("./validateBody");

async function getPersons(req, res) {
  try {
    const persons = await personService.getPersons();

    handleResponse(res, HTTP_STATUS_CODES.OK, {
      data: persons,
    });
  } catch (error) {
    handleError(res, error);
  }
}

async function getPerson(req, res) {
  try {
    const [, uuid] = splitUrl(req.url);
    const isValidUuid = validate(uuid);

    if (!isValidUuid) {
      throw new ValidationError("Passed uuid ins't valid");
    }

    const person = await personService.getPerson(uuid);

    handleResponse(res, HTTP_STATUS_CODES.OK, { data: person });
  } catch (error) {
    handleError(res, error);
  }
}

async function createPerson(req, res) {
  try {
    const body = await handleReqData(req);

    validateBody(body);

    const newPerson = await personService.createPerson(body);

    handleResponse(res, HTTP_STATUS_CODES.CREATED, { data: newPerson });
  } catch (error) {
    handleError(res, error);
  }
}

async function updatedPerson(req, res) {
  try {
    const [, uuid] = splitUrl(req.url);
    const isValidUuid = validate(uuid);

    if (!isValidUuid) {
      throw new ValidationError("Passed uuid ins't valid");
    }

    const body = await handleReqData(req);
    validateBody(body);

    const updatedPerson = await personService.updatePerson(uuid, body);

    handleResponse(res, HTTP_STATUS_CODES.OK, { data: updatedPerson });
  } catch (error) {
    handleError(res, error);
  }
}

async function deletePerson(req, res) {
  try {
    const [, uuid] = splitUrl(req.url);
    const isValidUuid = validate(uuid);

    if (!isValidUuid) {
      throw new ValidationError("Passed uuid ins't valid");
    }

    const removedPerson = await personService.deletePerson(uuid);

    handleResponse(res, HTTP_STATUS_CODES.OK, { data: removedPerson });
  } catch (error) {
    handleError(res, error);
  }
}

function handleNotFound(_, res) {
  handleResponse(res, HTTP_STATUS_CODES.NOT_FOUND, {
    error: "Route not found",
  });
}

module.exports = {
  getPersons,
  getPerson,
  createPerson,
  updatedPerson,
  deletePerson,
  handleNotFound,
};
