const express = require("express");
const router = express.Router();

async function addMovie(req, res) {
  try {
    await client.connect();

    const movieCollection = client.db("use-popcorn").collection("movies");

    router.post("/add-movie", async (req, res) => {
      const newMovie = req.body;
      const result = await movieCollection.insertOne(newMovie);
      res.send(result);
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
}
