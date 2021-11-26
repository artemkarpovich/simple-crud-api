const http = require("http");
const { HTTP_METHODS } = require("./constants");
const { normalizeUrl, isCorrectUrl } = require("./utils");
const {
  getPersons,
  getPerson,
  createPerson,
  updatedPerson,
  deletePerson,
  handleNotFound,
} = require("./person");

function createServer() {
  return http.createServer((req, res) => {
    const normalizedUrl = normalizeUrl(req.url);

    if (req.method === HTTP_METHODS.GET && normalizedUrl === "/person") {
      getPersons(req, res);
    } else if (req.method === HTTP_METHODS.GET && isCorrectUrl(req.url)) {
      getPerson(req, res);
    } else if (
      req.method === HTTP_METHODS.POST &&
      normalizedUrl === "/person"
    ) {
      createPerson(req, res);
    } else if (req.method === HTTP_METHODS.PUT && isCorrectUrl(req.url)) {
      updatedPerson(req, res);
    } else if (req.method === HTTP_METHODS.DELETE && isCorrectUrl(req.url)) {
      deletePerson(req, res);
    } else {
      handleNotFound(req, res);
    }
  });
}

module.exports = createServer;
