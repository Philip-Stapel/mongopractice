const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const dbConnect = require("./connection");
const port = process.env.NODE_ENV === "test" ? 1000 : 6000;
let db;
let entriesCollection;

async function startup() {
  await dbConnect.init();
  dbConnect
    .connect()
    .then(() => {
      db = dbConnect.db;
      entriesCollection = db.collection("entries");
      app.emit("dbConnected");
      app.isdbConnected = true;
      console.log("Database connected");
    })
    .catch((err) => {
      console.error("Error connecting to database", err);
    });
}

// function to connect to database

async function main() {
  await startup();
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
