const supertest = require("supertest");
const createServer = require("./server");
const { HTTP_STATUS_CODES } = require("./constants");

const server = createServer();

let newPersonId;

const person = {
  name: "John",
  age: 18,
  hobbies: ["sport", "travelling"],
};

const updatedPerson = {
  name: "John",
  age: 18,
  hobbies: ["sport", "travelling", "cooking"],
};

const validUuid = "905b4abb-0bfd-494e-b6fb-065f23ef0ab6";

describe("Person controller", () => {
  describe("GET /person", () => {
    test("should return empty array and status code 200", async () => {
      await supertest(server)
        .get("/person")
        .then((response) => {
          expect(Array.isArray(response.body.data)).toBeTruthy();
          expect(response.body.data.length).toEqual(0);
          expect(response.statusCode).toEqual(HTTP_STATUS_CODES.OK);
          expect(response.headers["content-type"]).toEqual(
            expect.stringContaining("application/json")
          );
        });
    });
  });

  describe("POST /person", () => {
    test("should return 400 status code due to missed body", async () => {
      await supertest(server)
        .post("/person")
        .then((response) => {
          expect(response.body.error).toEqual("Wrong body");
          expect(response.statusCode).toEqual(HTTP_STATUS_CODES.BAD_REQUEST);
          expect(response.headers["content-type"]).toEqual(
            expect.stringContaining("application/json")
          );
        });
    });

    test("should return 400 status code due to empty body", async () => {
      await supertest(server)
        .post("/person")
        .send({})
        .set("Accept", "application/json")
        .then((response) => {
          expect(response.body.error).toEqual("Body is empty");
          expect(response.statusCode).toEqual(HTTP_STATUS_CODES.BAD_REQUEST);
          expect(response.headers["content-type"]).toEqual(
            expect.stringContaining("application/json")
          );
        });
    });

    test("should return 400 status code due to missed name", async () => {
      await supertest(server)
        .post("/person")
        .send({ test: "1" })
        .set("Accept", "application/json")
        .then((response) => {
          expect(response.body.error).toEqual("Name is a required field");
          expect(response.statusCode).toEqual(HTTP_STATUS_CODES.BAD_REQUEST);
          expect(response.headers["content-type"]).toEqual(
            expect.stringContaining("application/json")
          );
        });
    });

    test("should return 400 status code due to invalid name type", async () => {
      await supertest(server)
        .post("/person")
        .send({ name: true })
        .set("Accept", "application/json")
        .then((response) => {
          expect(response.body.error).toEqual("Name should be a string type");
          expect(response.statusCode).toEqual(HTTP_STATUS_CODES.BAD_REQUEST);
          expect(response.headers["content-type"]).toEqual(
            expect.stringContaining("application/json")
          );
        });
    });

    test("should return 400 status code due to missed age property", async () => {
      await supertest(server)
        .post("/person")
        .send({ name: "John" })
        .set("Accept", "application/json")
        .then((response) => {
          expect(response.body.error).toEqual("Age is a required field");
          expect(response.statusCode).toEqual(HTTP_STATUS_CODES.BAD_REQUEST);
          expect(response.headers["content-type"]).toEqual(
            expect.stringContaining("application/json")
          );
        });
    });

    test("should return 400 status code due to invalid age type", async () => {
      await supertest(server)
        .post("/person")
        .send({ name: "John", age: "18" })
        .set("Accept", "application/json")
        .then((response) => {
          expect(response.body.error).toEqual("Age should be a number type");
          expect(response.statusCode).toEqual(HTTP_STATUS_CODES.BAD_REQUEST);
          expect(response.headers["content-type"]).toEqual(
            expect.stringContaining("application/json")
          );
        });
    });

    test("should return 400 status code due to invalid hobbies property type", async () => {
      await supertest(server)
        .post("/person")
        .send({ name: "John", age: 18, hobbies: {} })
        .set("Accept", "application/json")
        .then((response) => {
          expect(response.body.error).toEqual(
            "Hobbies should be an array of string"
          );
          expect(response.statusCode).toEqual(HTTP_STATUS_CODES.BAD_REQUEST);
          expect(response.headers["content-type"]).toEqual(
            expect.stringContaining("application/json")
          );
        });
    });

    test("should return 400 status code due to invalid hobby type of hobbies array", async () => {
      await supertest(server)
        .post("/person")
        .send({ name: "John", age: 18, hobbies: ["sport", null] })
        .set("Accept", "application/json")
        .then((response) => {
          expect(response.body.error).toEqual("Hobby should be a string type");
          expect(response.statusCode).toEqual(HTTP_STATUS_CODES.BAD_REQUEST);
          expect(response.headers["content-type"]).toEqual(
            expect.stringContaining("application/json")
          );
        });
    });

    test("should successfully create a new person", async () => {
      await supertest(server)
        .post("/person")
        .send(person)
        .set("Accept", "application/json")
        .then((response) => {
          newPersonId = response.body.data.id;
          expect(response.body.data.name).toEqual(person.name);
          expect(response.body.data.age).toEqual(person.age);
          expect(response.body.data.hobbies).toEqual(person.hobbies);
          expect(response.body.data).toHaveProperty("id");
          expect(response.statusCode).toEqual(HTTP_STATUS_CODES.CREATED);
          expect(response.headers["content-type"]).toEqual(
            expect.stringContaining("application/json")
          );
        });
    });
  });

  describe("GET /person/uuid", () => {
    test("should return error for invalid uuid and status code 400", async () => {
      await supertest(server)
        .get("/person/invalid-uuid")
        .then((response) => {
          expect(response.body.error).toEqual("Passed uuid ins't valid");
          expect(response.statusCode).toEqual(HTTP_STATUS_CODES.BAD_REQUEST);
          expect(response.headers["content-type"]).toEqual(
            expect.stringContaining("application/json")
          );
        });
    });

    test("should return error that person isn't found and status code 404", async () => {
      await supertest(server)
        .get(`/person/${validUuid}`)
        .then((response) => {
          expect(response.body.error).toEqual(
            `Person for ${validUuid} wasn't found`
          );
          expect(response.statusCode).toEqual(HTTP_STATUS_CODES.NOT_FOUND);
          expect(response.headers["content-type"]).toEqual(
            expect.stringContaining("application/json")
          );
        });
    });

    test("should return created person and status code 200", async () => {
      await supertest(server)
        .get(`/person/${newPersonId}`)
        .then((response) => {
          expect(response.body.data.name).toEqual(person.name);
          expect(response.body.data.age).toEqual(person.age);
          expect(response.body.data.hobbies).toEqual(person.hobbies);
          expect(response.body.data.id).toEqual(newPersonId);
          expect(response.statusCode).toEqual(HTTP_STATUS_CODES.OK);
          expect(response.headers["content-type"]).toEqual(
            expect.stringContaining("application/json")
          );
        });
    });
  });

  describe("PUT /person/uuid", () => {
    test("should return updated person and status code 200", async () => {
      await supertest(server)
        .put(`/person/${newPersonId}`)
        .send(updatedPerson)
        .set("Accept", "application/json")
        .then((response) => {
          expect(response.body.data.name).toEqual(updatedPerson.name);
          expect(response.body.data.age).toEqual(updatedPerson.age);
          expect(response.body.data.hobbies).toEqual(updatedPerson.hobbies);
          expect(response.body.data.id).toEqual(newPersonId);
          expect(response.statusCode).toEqual(HTTP_STATUS_CODES.OK);
          expect(response.headers["content-type"]).toEqual(
            expect.stringContaining("application/json")
          );
        });
    });

    test("should return error and status code 400", async () => {
      await supertest(server)
        .put(`/person/invalid uuid`)
        .send(updatedPerson)
        .set("Accept", "application/json")
        .then((response) => {
          expect(response.body.error).toEqual("Passed uuid ins't valid");
          expect(response.statusCode).toEqual(HTTP_STATUS_CODES.BAD_REQUEST);
          expect(response.headers["content-type"]).toEqual(
            expect.stringContaining("application/json")
          );
        });
    });

    test("should return error and status code 404", async () => {
      await supertest(server)
        .put(`/person/${validUuid}`)
        .send(updatedPerson)
        .set("Accept", "application/json")
        .then((response) => {
          expect(response.body.error).toEqual(
            `No person with ${validUuid} found`
          );
          expect(response.statusCode).toEqual(HTTP_STATUS_CODES.NOT_FOUND);
          expect(response.headers["content-type"]).toEqual(
            expect.stringContaining("application/json")
          );
        });
    });
  });

  describe("DELETE /person/uuid", () => {
    test("should delete the person and return status code 204", async () => {
      await supertest(server)
        .delete(`/person/${newPersonId}`)
        .then((response) => {
          expect(response.statusCode).toEqual(HTTP_STATUS_CODES.NO_CONTENT);
          expect(response.headers["content-type"]).toEqual(
            expect.stringContaining("application/json")
          );
        });
    });

    test("should return error and return status code 400", async () => {
      await supertest(server)
        .delete(`/person/invalid uuid`)
        .then((response) => {
          expect(response.body.error).toEqual("Passed uuid ins't valid");
          expect(response.statusCode).toEqual(HTTP_STATUS_CODES.BAD_REQUEST);
          expect(response.headers["content-type"]).toEqual(
            expect.stringContaining("application/json")
          );
        });
    });

    test("should return error that person isn't found and return status code 404", async () => {
      await supertest(server)
        .delete(`/person/${validUuid}`)
        .then((response) => {
          expect(response.body.error).toEqual(
            `No person with ${validUuid} found`
          );
          expect(response.statusCode).toEqual(HTTP_STATUS_CODES.NOT_FOUND);
          expect(response.headers["content-type"]).toEqual(
            expect.stringContaining("application/json")
          );
        });
    });
  });

  describe("GET /person after delete", () => {
    test("should return empty array", async () => {
      await supertest(server)
        .get("/person")
        .then((response) => {
          expect(Array.isArray(response.body.data)).toBeTruthy();
          expect(response.body.data.length).toEqual(0);
          expect(response.statusCode).toEqual(HTTP_STATUS_CODES.OK);
          expect(response.headers["content-type"]).toEqual(
            expect.stringContaining("application/json")
          );
        });
    });
  });

  describe("Not found route", () => {
    test("should return status code 404 and error message", async () => {
      await supertest(server)
        .get("/not-found-route")
        .then((response) => {
          expect(response.statusCode).toEqual(HTTP_STATUS_CODES.NOT_FOUND);
          expect(response.headers["content-type"]).toEqual(
            expect.stringContaining("application/json")
          );
        });
    });
  });
});
