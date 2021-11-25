const { HTTP_STATUS_CODES } = require("../constants");
const { ValidationError, DBError } = require("../errors");
const { handleReqData } = require("../utils");
const personService = require("./service");
const validateBody = require("./validateBody");

async function getPersons(req, res) {
  try {
    const persons = await personService.getPersons();

    res.writeHead(HTTP_STATUS_CODES.OK, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        data: persons,
      })
    );
  } catch (error) {
    res.writeHead(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        error: "Something went wrong.",
      })
    );
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
    res.writeHead(HTTP_STATUS_CODES.OK, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ data: person }));
  } catch (error) {
    if (error instanceof ValidationError) {
      res.writeHead(HTTP_STATUS_CODES.BAD_REQUEST, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: error.message }));
    }

    if (error instanceof DBError) {
      res.writeHead(HTTP_STATUS_CODES.NOT_FOUND, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: error.message }));
    }

    res.writeHead(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Something went wrong." }));
  }
}

async function createPerson(req, res) {
  try {
    const body = await handleReqData(req);
    validateBody(body);
    const newPerson = await personService.createPerson(body);

    res.writeHead(HTTP_STATUS_CODES.CREATED, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ data: newPerson }));
  } catch (error) {
    if (error instanceof ValidationError) {
      res.writeHead(HTTP_STATUS_CODES.BAD_REQUEST, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: error.message }));
    }

    if (error instanceof DBError) {
      res.writeHead(HTTP_STATUS_CODES.NOT_FOUND, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: error.message }));
    }

    res.writeHead(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Something went wrong." }));
  }
}

async function updatedPerson(req, res) {
  try {
    const [, uuid] = splitedUrl;
    const isValidUuid = validate(uuid);

    if (!isValidUuid) {
      throw new ValidationError("Passed uuid ins't valid");
    }

    const body = await handleReqData(req);
    validateBody(body);

    const updatedPerson = await personService.updatePerson(uuid, body);
    res.writeHead(HTTP_STATUS_CODES.OK, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ data: updatedPerson }));
  } catch (error) {
    if (error instanceof ValidationError) {
      res.writeHead(HTTP_STATUS_CODES.BAD_REQUEST, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: error.message }));
    }

    if (error instanceof DBError) {
      res.writeHead(HTTP_STATUS_CODES.NOT_FOUND, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: error.message }));
    }

    res.writeHead(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Something went wrong." }));
  }
}

async function deletePerson(req, res) {
  try {
    const [, uuid] = splitedUrl;
    const isValidUuid = validate(uuid);

    if (!isValidUuid) {
      throw new ValidationError("Passed uuid ins't valid");
    }

    const removePerson = await personService.deletePerson(uuid);
    res.writeHead(HTTP_STATUS_CODES.NOT_FOUND, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: true, data: removePerson }));
  } catch (error) {
    if (error instanceof ValidationError) {
      res.writeHead(HTTP_STATUS_CODES.BAD_REQUEST, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: error.message }));
    }

    if (error instanceof DBError) {
      res.writeHead(HTTP_STATUS_CODES.NOT_FOUND, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: error.message }));
    }

    res.writeHead(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Something went wrong." }));
  }
}

module.exports = {
  getPersons,
  getPerson,
  createPerson,
  updatedPerson,
  deletePerson,
};
