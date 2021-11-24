const http = require("http");
const config = require("./config");
const Person = require("./person");

const server = http.createServer((req, res) => {
  const persons = new Person().getPersons();
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      data: persons,
    })
  );
});

server.listen(config.PORT, () => console.log(`Application is successfully running on port: ${config.PORT}`));
