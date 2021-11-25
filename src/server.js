const http = require("http");
const { validate } = require("uuid");
const config = require("./config");
const { HTTP_METHODS, HTTP_STATUS_CODES } = require("./constants");
const { normalizeUrl, splitUrl } = require("./utils");
const { getPersons, getPerson, createPerson, updatedPerson, deletePerson } = require("./person");
const { ValidationError, DBError } = require("./errors");

const server = http.createServer(async (req, res) => {
  const normalizedUrl = normalizeUrl(req.url);
  const splitedUrl = splitUrl(req.url);

  if (req.method === HTTP_METHODS.GET && normalizedUrl === "/person") {
    getPersons(req, res);
  } else if (req.method === HTTP_METHODS.GET && normalizedUrl.includes("/person/") && splitedUrl.length === 2) {
    getPerson(req, res);
  } else if (req.method === HTTP_METHODS.POST && normalizedUrl === "/person") {
    createPerson(req, res);
  } else if (req.method === HTTP_METHODS.PUT && normalizedUrl.includes("/person/") && splitedUrl.length === 2) {
    updatedPerson(req, res);
  } else if (req.method === HTTP_METHODS.DELETE && normalizedUrl.includes("/person/") && splitedUrl.length === 2) {
    deletePerson(req, res);
  } else {
    res.writeHead(HTTP_STATUS_CODES.NOT_FOUND, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Route not found" }));
  }
});

server.listen(config.PORT, () => console.log(`Application is successfully running on port: ${config.PORT}`));
