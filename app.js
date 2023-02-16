const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
let port = 6000;
if (process.env.NODE_ENV === "test") {
  port = 1000
}
const connectionDB = require("./connection");
let collection;
let entriesCollection;
let db;

// function to connect to database
async function startup() {
  console.log('starting')
  await connectionDB.init();
  console.log('connected')
  // when connected emit 'dbconnected' so can be detected to start tests
  // also set isdbconnected to true in case the database is connected before the tests check for the emit above
  app.emit("dbConnected");
  app.isDbConnected = true;

  // set db to the db property of the connectionDB class
  db = connectionDB.db;
  collection = db.collection("documents");
  entriesCollection = db.collection("entries");
}

async function main() {
  startup()
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

  app.get("/entries", async (req, res) => {
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
}

main()
  .then(() => {
    app.listen(port, () => {
      console.log("server is up on port " + port);
    });
  })
  .catch(console.error);

module.exports = app;
