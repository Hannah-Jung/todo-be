const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const indexRouter = require("./routes/index");
require("dotenv").config();

const app = express();
const MONGODB_URI = process.env.MONGODB_URI;
app.use(bodyParser.json());
app.use(cors());
app.use("/api", indexRouter);
const PORT = process.env.PORT || 5000;
const mongoURI = MONGODB_URI;

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Mongoose connected");
  })
  .catch((err) => {
    console.log("DB connection failed", err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
