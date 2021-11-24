const http = require("http");
const config = require("./config");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      data: "Hello World!",
    })
  );
});

server.listen(config.PORT, () => console.log(`Application is successfully running on port: ${config.PORT}`));
