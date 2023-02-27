"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const express_1 = __importDefault(require("express"));
const connection_1 = require("./connection");
let database;
let entriesCollection;
async function startup() {
    database = new connection_1.Database();
    await database.connect();
    const addressBookDatabase = database.db;
    entriesCollection = addressBookDatabase.collection("entries");
    console.log("Database is connected");
}
async function main() {
    const app = (0, express_1.default)();
    app.use(express_1.default.urlencoded({ extended: false }));
    app.use(express_1.default.json());
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
                .send("New entry for " + req.body.name + " has been added! Stay in touch!");
        }
        else {
            res.status(400).send("Please enter valid data");
        }
    });
    app.get("/entries", async (_req, res) => {
        const entries = await entriesCollection.find({}).toArray();
        if (entries.length === 0) {
            res.status(404).send("No entries found");
        }
        else {
            res.status(200).send(entries);
        }
    });
    app.delete("/entries/:id", async (req, res) => {
        await entriesCollection.deleteOne({ id: req.params.id });
        res.status(200).send({ message: "Entry deleted successfully" });
    });
    app.patch("/entries/:id", async (req, res) => {
        const result = await entriesCollection.updateOne({ id: req.params.id }, { $set: req.body });
        if (result.modifiedCount === 0) {
            res.status(404).send("no matching records");
        }
        else {
            res.status(200).send("Entry updated successfully");
        }
    });
    return app;
}
exports.main = main;
//# sourceMappingURL=app.js.map