import express from "express";
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
import { MongoClient, MongoClientOptions } from "mongodb";

export class Database {
  private client?: MongoClient;
  constructor(private url = process.env["MONGO_URL"]) {}
  // if no url is specified environment variable will be used
  async connect(): Promise<void> {
    const options: MongoClientOptions = { useUnifiedTopology: true } as any;
    this.client = await MongoClient.connect(this.url!, options);
    console.log(`Connected to ${this.url}`);
  }

  async close(): Promise<void> {
    if (this.client) {
      await this.client.close();
    }
  }

  get db() {
    if (!this.client) {
      throw new Error("Client not connected");
    }
    return this.client.db("addressbook");
  }
}
// If the client exists, it returns the db
// property of the client object, which is the addressbook database.
