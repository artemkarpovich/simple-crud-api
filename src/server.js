const http = require("http");
const config = require("./config");
const { HTTP_METHODS, HTTP_STATUS_CODES } = require("./constants");
const { normalizeUrl } = require("./utils");
const Person = require("./person");

const server = http.createServer(async (req, res) => {
  if (req.method === HTTP_METHODS.GET && normalizeUrl(req.url) === "/person") {
    try {
      const persons = await Person.getPersons();

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
  } else {
    res.writeHead(HTTP_STATUS_CODES.NOT_FOUND, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Route not found" }));
  }
});

server.listen(config.PORT, () => console.log(`Application is successfully running on port: ${config.PORT}`));
