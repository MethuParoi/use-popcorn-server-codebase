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
    // app.patch("/update-movie/:id", async (req, res) => {
    //   const id = req.params.id;
    //   // Convert id to ObjectId
    //   const objectId = new ObjectId(id);
    //   const updatedMovie = req.body;
    //   const result = await movieCollection.updateOne(
    //     { _id: objectId },
    //     { $set: updatedMovie }
    //   );
    //   res.send(result);
    // });

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
