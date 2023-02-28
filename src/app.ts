import express, { Express } from "express";
import type { Collection } from "mongodb";
import { Database } from "./connection";

let database: Database;
let entriesCollection: Collection;

// startup connects to mongoDB database and returns Database object.

async function startup(mongoURI?: string): Promise<Database> {
  database = new Database(mongoURI);
  // creates Database object using mongoURI string parameter
  await database.connect();
  // establishes connection to the database
  const addressBookDatabase = database.db;
  entriesCollection = addressBookDatabase.collection("entries");

  console.log("Database is connected");
  return database;
}
export async function main(
  mongoURI?: string
): Promise<{ app: Express; database: Database }> {
  const app = express();
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  const database = await startup(mongoURI);

  app.post("/entries", async (req, res) => {
    const entry = {
      id: req.body.id,
      name: req.body.name,
      address: req.body.address,
      email: req.body.email,
      age: req.body.age,
    };

    await entriesCollection.insertOne(entry);
    if (entry.name.length > 1) {
      res
        .status(201)
        .send(
          "New entry for " + req.body.name + " has been added! Stay in touch!"
        );
    } else {
      res.status(400).send("Please enter valid data");
    }
  });

  app.get("/entries", async (_req, res) => {
    const entries = await entriesCollection.find({}).toArray();
    if (entries.length === 0) {
      res.status(404).send("No entries found");
    } else {
      res.status(200).send(entries);
    }
  });

  app.delete("/entries/:id", async (req, res) => {
    await entriesCollection.deleteOne({ id: req.params.id });
    res.status(200).send({ message: "Entry deleted successfully" });
  });

  app.patch("/entries/:id", async (req, res) => {
    const result = await entriesCollection.updateOne(
      { id: req.params.id },
      { $set: req.body }
    );
    if (result.modifiedCount === 0) {
      res.status(404).send("no matching records");
    } else {
      res.status(200).send("Entry updated successfully");
    }
  });
  return { app, database };
}
