const http = require("http");
const { validate } = require("uuid");
const config = require("./config");
const { HTTP_METHODS, HTTP_STATUS_CODES } = require("./constants");
const { normalizeUrl } = require("./utils");
const personService = require("./person");

const server = http.createServer(async (req, res) => {
  const normalizedUrl = normalizeUrl(req.url);

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
  } else if (
    req.method === HTTP_METHODS.GET &&
    normalizedUrl.includes("/person/") &&
    normalizedUrl.split("/").slice(1).length === 2
  ) {
    try {
      const [, uuid] = normalizedUrl.split("/").slice(1);
      const isValidUuid = validate(uuid);

      if (!isValidUuid) {
        throw new Error("Passed uuid ins't valid");
      }

      try {
        const person = await personService.getPerson(uuid);
        res.writeHead(HTTP_STATUS_CODES.OK, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ data: person }));
      } catch (error) {
        res.writeHead(HTTP_STATUS_CODES.NOT_FOUND, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: error.message }));
      }
    } catch (error) {
      res.writeHead(HTTP_STATUS_CODES.BAD_REQUEST, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
    }
  } else {
    res.writeHead(HTTP_STATUS_CODES.NOT_FOUND, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Route not found" }));
  }
});

server.listen(config.PORT, () => console.log(`Application is successfully running on port: ${config.PORT}`));
