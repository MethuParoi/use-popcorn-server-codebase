const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const rootRouter = require("./routes/index");
app.use("/api/v1", rootRouter);

app.get("/", (req, res) => {
  res.send("UsePopCorn server running");
});

const port = process.env.PORT || 3000;
app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`listening on port: ${PORT}`);
});
