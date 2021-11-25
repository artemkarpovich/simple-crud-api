const http = require("http");
const { validate } = require("uuid");
const config = require("./config");
const { HTTP_METHODS, HTTP_STATUS_CODES } = require("./constants");
const { normalizeUrl, handleReqData, splitUrl } = require("./utils");
const { personService, validateBody } = require("./person");
const { ValidationError, DBError } = require("./errors");

const server = http.createServer(async (req, res) => {
  const normalizedUrl = normalizeUrl(req.url);
  const splitedUrl = splitUrl(normalizedUrl);

  if (req.method === HTTP_METHODS.GET && normalizedUrl === "/person") {
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
          error: "Something went wrong",
        })
      );
    }
  } else if (req.method === HTTP_METHODS.GET && normalizedUrl.includes("/person/") && splitedUrl.length === 2) {
    try {
      const [, uuid] = splitedUrl;
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
      res.end(JSON.stringify({ error: error.message }));
    }
  } else if (req.method === HTTP_METHODS.POST && normalizedUrl === "/person") {
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
      res.end(JSON.stringify({ error: error.message }));
    }
  } else if (req.method === HTTP_METHODS.PUT && normalizedUrl.includes("/person/") && splitedUrl.length === 2) {
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
      res.end(JSON.stringify({ error: error.message }));
    }
  } else {
    res.writeHead(HTTP_STATUS_CODES.NOT_FOUND, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Route not found" }));
  }
});

server.listen(config.PORT, () => console.log(`Application is successfully running on port: ${config.PORT}`));
