"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
const mongodb_1 = require("mongodb");
// class  connection to mongodb or mongomemoryserver
class Database {
    url;
    client;
    // mongodb://localhost:27017
    constructor(url = process.env["MONGO_URL"]) {
        this.url = url;
    }
    async connect() {
        const options = { useUnifiedTopology: true };
        this.client = await mongodb_1.MongoClient.connect(this.url, options);
        console.log(`Connected to ${this.url}`);
    }
    async close() {
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
exports.Database = Database;
//# sourceMappingURL=connection.js.map