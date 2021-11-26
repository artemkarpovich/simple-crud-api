const createServer = require("./src/server");
const config = require("./src/config");

const server = createServer();

server.listen(config.PORT, () =>
  console.log(`Application is successfully running on port: ${config.PORT}`)
);
