const { ValidationError } = require("./errors");

function handleReqData(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const parsedData = JSON.parse(body);
        resolve(parsedData);
      } catch (error) {
        reject(new ValidationError("Wrong body"));
      }
    });
    req.on("error", reject);
  });
}

function normalizeUrl(url) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function splitUrl(url) {
  return normalizeUrl(url).split("/").slice(1);
}

module.exports = {
  handleReqData,
  normalizeUrl,
  splitUrl,
};
