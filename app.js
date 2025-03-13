const express = require("express");
const app = express();
const mongoose = require("mongoose");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
  console.log("Connected to DB successful");
}).catch((err) => {
  console.log(err);
});

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.get("/", function(req, res) {
  res.send("Hi. I am root");
});

app.listen(8080, function() {
  console.log("Server started at port : 8080");
});