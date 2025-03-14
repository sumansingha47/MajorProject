const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");

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

// app.get("/testListing", async function(req, res) {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India"
//   });

//   await sampleListing.save().then((res) => {
//     console.log(res);
//     console.log("sample listing is saved");
//   }).catch((err) => {
//     console.log(err);
//   });
//   res.send("successful testing");
// });

app.listen(8080, function() {
  console.log("Server started at port : 8080");
});