// const express = require('express');
// const app = express();
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());
// const port = 2000;
// const { addEntry, deleteEntry, getEntries, updateEntry } = require('./src/__test__/entries');
//
// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb://localhost:27017";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//     const entriesCollection = client.db("test").collection("entries");
//
//     app.post('/entries', async (req, res) => {
//         const entry =
//             {
//
//                 name: req.body.name,
//                 address: req.body.address,
//                 email: req.body.email,
//                 age: req.body.age
//             };
//
//         await entriesCollection.insertOne(entry);
//         if (entry.name.length > 1) {
//             res.status(201).send('New entry for ' + req.body.name + ' has been added! Stay in touch!');
//         } else {
//             res.status(400).send('Please enter valid data');
//         }
//     });
//
//     app.get('/entries', async (req, res) => {
//         const entries = await entriesCollection.find({}).toArray();
//         if (entries.length === 0) {
//             res.status(404).send({error: 'No entries found'});
//         } else {
//             res.status(200).send(entries);
//         }
//     });
//
//     app.delete('/entries/:id', async (req, res) => {
//         await entriesCollection.deleteOne({id: req.params.id});
//         res.status(200).send({message: 'Entry deleted successfully'});
//     });
//
//     app.patch('/entries/:id', async (req, res) => {
//         const result = await entriesCollection.updateOne({id: req.params.id}, {$set: req.body});
//         if (result.modifiedCount === 0) {
//             res.status(404).send({message: 'no matching records'});
//         } else {
//             res.status(200).send({message: 'Entry updated successfully'});
//         }
//     });
//
//
//
//
// })
// app.listen(port, () => {
//     console.log('server is up on port' + port);
// }