import express from "express";
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
import { MongoClient, MongoClientOptions } from "mongodb";

// class  connection to mongodb or mongomemoryserver
export class Database {
  private client?: MongoClient;
  // mongodb://localhost:27017
  constructor(private url = process.env["MONGO_URL"]) {}

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
