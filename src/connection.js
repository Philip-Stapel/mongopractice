const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const { MongoClient } = require("mongodb");
const { MongoMemoryServer } = require("mongodb-memory-server");

// class for connection to mongodb or mongomemoryserver
class dbConnect {
  async init() {
    if (process.env.NODE_ENV === "test") {
      let mongod = await MongoMemoryServer.create();
      this.url = mongod.getUri();
    } else {
      this.url = "mongodb://mongo:27017";
    }
  }
  connect() {
    return MongoClient.connect(this.url, { useUnifiedTopology: true }).then(
      (client) => {
        this.client = client;
        this.db = client.db("addressbook");
        console.log(`Connected to ${this.url}`);
      }
    );
  }

  close() {
    return this.client.close();
  }
}

// export class
module.exports = new dbConnect();
