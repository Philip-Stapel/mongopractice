const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const { MongoClient } = require("mongodb");
const { MongoMemoryServer } = require("mongodb-memory-server");

class dbConnect {
  async init() {
    let url;
    if (process.env.NODE_ENV === "test") {
      let mongodb = await MongoMemoryServer.create();
      url = mongodb.getUri();
    } else {
      url = "mongodb://localhost:27017";
    }

    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.client.connect();
    console.log(`connected to ${url}`);

    this.db = this.client.db("addressbook");
  }
}

module.exports = new dbConnect();
