const express = require("express");
const addMovieRouter = require("./add-movie");

const router = express.Router();

router.use("/add-movie", addMovieRouter);

module.exports = router;
