require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");

const app = express();

//use middleware
app.use(express.json());
app.use(cors());

//mongoDB connection

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@use-popcorn-cluster.fhpfd.mongodb.net/?retryWrites=true&w=majority&appName=use-popcorn-cluster`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
    // add a new movie
    const movieCollection = client.db("use-popcorn").collection("movies");

    //add new movie
    app.post("/add-movie", async (req, res) => {
      const newMovie = req.body;
      const result = await movieCollection.insertOne(newMovie);
      res.send(result);
    });

    //get all movies
    app.get("/all-movies", async (req, res) => {
      const result = await movieCollection.find({}).toArray();
      res.send(result);
    });

    //get a single movie
    app.get("/movie/:id", async (req, res) => {
      const id = req.params.id;

      try {
        // Convert id to ObjectId
        const objectId = new ObjectId(id);
        const result = await movieCollection.findOne({ _id: objectId });

        if (result) {
          res.send(result);
          // res.send("Movie found");
        } else {
          res.status(404).send({ message: "Movie not found" });
        }
      } catch (error) {
        console.error("Error fetching movie:", error);
        res.status(400).send({ message: "Invalid movie ID" });
      }
    });

    //update a movie
    app.patch("/update-movie/:id", async (req, res) => {
      const id = req.params.id;
      // Convert id to ObjectId
      const objectId = new ObjectId(id);
      const updatedMovie = req.body;
      const result = await movieCollection.updateOne(
        { _id: objectId },
        { $set: updatedMovie }
      );
      res.send(result);
    });

    // Delete a movie

    app.delete("/delete-movie/:id", async (req, res) => {
      const id = req.params.id;
      // Convert id to ObjectId
      const objectId = new ObjectId(id);
      const result = await movieCollection.deleteOne({ _id: objectId });
      res.send(result);
    });
    //--------------------------------------------------
    //favorite movie collection
    const favoriteMovieCollection = client
      .db("use-popcorn")
      .collection("favoriteMovies");

    //add favorite movie first time
    app.put("/add-favorite-movie", async (req, res) => {
      const newFavoriteMovie = req.body;
      const result = await favoriteMovieCollection.insertOne(newFavoriteMovie);
      res.send(result);
    });

    // add movie
    app.patch("/update-favorite-movie/:id", async (req, res) => {
      const id = req.params.id;
      // Convert id to ObjectId
      const movies = req.body;
      const result = await favoriteMovieCollection.updateOne(
        { user_id: id },
        { $set: movies }
      );
      res.send(result);
    });

    // Delete favorite movie
    app.delete("/delete-favorite-movie/:id/:mid", async (req, res) => {
      const userId = req.params.id; // User email
      const movieId = req.params.mid; // Movie ID to delete

      try {
        const result = await favoriteMovieCollection.updateOne(
          { user_id: userId }, // Match user by ID
          { $pull: { movies: movieId } } // Remove the specific movie ID from the array
        );

        if (result.modifiedCount > 0) {
          res.status(200).send({ message: "Movie deleted from favorites" });
        } else {
          res.status(404).send({ message: "Movie not found in favorites" });
        }
      } catch (error) {
        console.error("Error deleting favorite movie:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    //get favorite movie
    app.get("/favorite-movie/:id", async (req, res) => {
      const id = req.params.id;

      try {
        // Convert id to ObjectId
        // const objectId = new ObjectId(id);
        const result = await favoriteMovieCollection.findOne({
          user_id: id,
        });

        if (result) {
          res.send(result);
          // res.send("Movie found");
        } else {
          res.status(404).send({ message: "favorite movie not found" });
        }
      } catch (error) {
        console.error("Error fetching favorite movie:", error);
        res.status(400).send({ message: "Invalid favorite movie ID" });
      }
    });

    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//-------------------------------------

// const rootRouter = require("./routes/index");
// app.use("/api", rootRouter);

app.get("/", (req, res) => {
  res.send("UsePopCorn server running");
});

const port = process.env.PORT || 3000;
app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`listening on port: ${port}`);
});
