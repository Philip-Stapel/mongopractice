const MongoClient = require("mongodb").MongoClient;
const request = require("supertest");
const mongodb = require("mongodb");
const connectionDB = require("../../connection.js");
let db;
const app = require("../../app.js");

beforeEach(function (done) {
  if (app.isDbConnected) {
    db = connectionDB.db;
    process.nextTick(done);
  } else {
    app.on("dbConnected", () => {
      db = connectionDB.db;
      done();
    });
  }
});
afterEach(async () => {
  await db.collection("entries").deleteMany({});
});

describe("post /entries", () => {
  it("creates a new entry", async () => {
    const response = await request(app).post("/entries").send({
      id: "1",
      name: "Phil",
      address: "london",
      email: "phil@example.com",
      age: 30,
    });
    expect(response.statusCode).toBe(201);
    expect(response.text).toBe(
      "New entry for Phil has been added! Stay in touch!"
    );
  });
  it("gives a 400 when invalid data is added", async () => {
    const response = await request(app).post("/entries").send({
      name: "",
      address: "orchard street",
      email: "darry@email.com",
      age: 30,
    });
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe("Please enter valid data");
  });
});
describe("GET /entries", () => {
  it("gets all the entries", async () => {
    await db.collection("entries").insertMany([
      {
        id: "1",
        name: "Phil",
        address: "london",
        email: "phil@example.com",
        age: 30,
      },
      {
        id: "2",
        name: "gavin",
        address: "canterbury",
        email: "gavin@example.com",
        age: 30,
      },
    ]);
    const response = await request(app).get("/entries");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(2);
  });
  it("returns 404 when no entries found", async () => {
    const response = await request(app).get("/entries");
    expect(response.statusCode).toBe(404);
    expect(response.text).toBe("No entries found");
  });
});
describe("DELETE /entries", () => {
  it("deletes specified entry from database and returns 200", async () => {
    await db.collection("entries").insertMany([
      {
        id: "1",
        name: "Phil",
        address: "london",
        email: "phil@example.com",
        age: 30,
      },
      {
        id: "2",
        name: "gavin",
        address: "canterbury",
        email: "gavin@example.com",
        age: 30,
      },
    ]);
    const response = await request(app).delete("/entries/2").send();
    expect(response.statusCode).toBe(200);
    const entriesCollection = db.collection("entries");
    const entries = await entriesCollection.find({}).toArray();
    console.log(entries);
    expect(entries.length).toEqual(1);
  });
});
describe("PATCH /entries", () => {
  it("edits the correct post", async () => {
    await db.collection("entries").insertMany([
      {
        id: "1",
        name: "Phil",
        address: "london",
        email: "phil@example.com",
        age: 30,
      },
      {
        id: "2",
        name: "gavin",
        address: "canterbury",
        email: "gavin@example.com",
        age: 30,
      },
    ]);
    const response = await request(app).patch("/entries/2").send({
      id: "2",
      name: "steven",
      address: "canterbury",
      email: "gavin@example.com",
      age: 30,
    });
    const entriesCollection = db.collection("entries");
    const entries = await entriesCollection.find({ id: "2" }).toArray();
    console.log(entries);
    expect(entries.length).toBe(1);
    expect(entries[0].name).toBe("steven");
  });
});
it("gives 404 if not records were changed", async () => {
  await db.collection("entries").insertOne({
    id: "1",
    name: "Phil",
    address: "london",
    email: "phil@example.com",
    age: 30,
  });
  const response = await request(app).patch("/entries/2").send({
    id: "2",
    name: "steven",
    address: "canterbury",
    email: "gavin@example.com",
    age: 30,
  });
  expect(response.status).toBe(404);
  console.log(response.text);
  expect(response.text).toEqual("no matching records");
});
