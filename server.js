const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

const { connectToDB } = require('./lib/mongo');
const { getAllCats, insertNewCat } = require('./models/cat');

const app = express();
const port = process.env.PORT || 8000;

app.use(bodyParser.json());

app.get('/cats', async (req, res) => {
  try {
    const cats = await getAllCats();
    res.status(200).send({ cats: cats });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Error fetching cats" });
  }
});

app.post('/cats', async (req, res) => {
  if (req.body && req.body.url) {
    try {
      const id = await insertNewCat(req.body);
      res.status(201).send({ _id: id });
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: "Failed to insert new cat." });
    }
  } else {
    res.status(400).send({
      error: "Request doesn't contain a valid cat."
    });
  }
});

app.use('*', (req, res, next) => {
  res.status(404).send({
    err: "Path " + req.originalUrl + " does not exist"
  });
});

connectToDB(() => {
  app.listen(port, () => {
    console.log("== Server is running on port", port);
  });
});
