const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const { MongoClient } = require("mongodb");
const { MongoMemoryServer } = require("mongodb-memory-server");

// class for connection to mongodb or mongomemoryserver
class dbConnect {
  async init() {
    let url;
    // if in testing then create mongomemoryserver instance and get url
    if (process.env.NODE_ENV === "test") {
      console.log('starting mms')
      let mongodb = await MongoMemoryServer.create();
      url = mongodb.getUri();
      this.mongodb = mongodb
      // if not in test then url of mongodb image
    } else {
      url = "mongodb://mongo:27017";
    }
// create client based on url and connect
    let client = new MongoClient(url, { useUnifiedTopology: true });
    await client.connect();
    console.log(`connected to ${url}`);
// set class property to access db from app and tets
    this.db = client.db("addressbook");
  }
}

// export class
module.exports = new dbConnect();
