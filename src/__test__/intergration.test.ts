import request from "supertest";
import { Database } from "../connection";
import { main } from "../app";
import { MongoMemoryServer } from "mongodb-memory-server";
import type { Db } from "mongodb";
import type { Express } from "express";
import type { Server } from "http";

let db: Database;
let addressBookDatabase: Db;
let mongoMemoryServer: MongoMemoryServer;
let app: Express;
let server: Server;
let mainDatabase: Database;
beforeAll(async function () {
  mongoMemoryServer = await MongoMemoryServer.create();
  const uri = mongoMemoryServer.getUri();
  ({ app, database: mainDatabase } = await main(uri));
  server = app.listen(0);
  db = new Database(uri);
  await db.connect();
  addressBookDatabase = db.db;
});

// after each tests empty the database
afterEach(async () => {
  await addressBookDatabase.collection("entries").deleteMany({});
});

afterAll(async () => {
  await mainDatabase.close();
  await db.close(); //we want to close before we stop
  await mongoMemoryServer.stop();
  server.close();
});

describe("post /entries", () => {
  it("creates a new entry", async () => {
    const response = await request(server).post("/entries").send({
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
    const response = await request(server).post("/entries").send({
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
    await addressBookDatabase.collection("entries").insertMany([
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

    const response = await request(server).get("/entries");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(2);
  });
  it("returns 404 when no entries found", async () => {
    const response = await request(server).get("/entries");
    expect(response.statusCode).toBe(404);
    expect(response.text).toBe("No entries found");
  });
});
describe("DELETE /entries", () => {
  it("deletes specified entry from database and returns 200", async () => {
    //have typescript objects for entry

    await addressBookDatabase.collection("entries").insertMany([
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
    const response = await request(server).delete("/entries/2").send();
    expect(response.statusCode).toBe(200);
    const entriesCollection = addressBookDatabase.collection("entries");
    const entries = await entriesCollection.find({}).toArray();
    console.log(entries);
    expect(entries.length).toEqual(1);
  });
});
describe("PATCH /entries", () => {
  it("edits the correct post", async () => {
    await addressBookDatabase.collection("entries").insertMany([
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
    await request(server).patch("/entries/2").send({
      id: "2",
      name: "steven",
      address: "canterbury",
      email: "gavin@example.com",
      age: 30,
    });
    const entriesCollection = addressBookDatabase.collection("entries");
    const entries = await entriesCollection.find({ id: "2" }).toArray();
    console.log(entries);
    expect(entries.length).toBe(1);
    expect(entries[0]?.["name"]).toBe("steven");
  });
});
it("gives 404 if not records were changed", async () => {
  await addressBookDatabase.collection("entries").insertOne({
    id: "1",
    name: "Phil",
    address: "london",
    email: "phil@example.com",
    age: 30,
  });
  const response = await request(server).patch("/entries/2").send({
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
