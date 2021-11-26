const { ValidationError, DBError } = require("./errors");
const { HTTP_STATUS_CODES } = require("./constants");

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

function isCorrectUrl(url) {
  const normalizedUrl = normalizeUrl(url);
  const splitedUrl = splitUrl(url);

  return normalizedUrl.includes("/person/") && splitedUrl.length === 2;
}

function handleResponse(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function handleError(res, error) {
  if (error instanceof ValidationError) {
    return handleResponse(res, HTTP_STATUS_CODES.BAD_REQUEST, {
      error: error.message,
    });
  }

  if (error instanceof DBError) {
    return handleResponse(res, HTTP_STATUS_CODES.NOT_FOUND, {
      error: error.message,
    });
  }

  handleResponse(res, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, {
    error: "Something went wrong.",
  });
}

module.exports = {
  handleReqData,
  normalizeUrl,
  splitUrl,
  handleResponse,
  handleError,
  isCorrectUrl,
};
