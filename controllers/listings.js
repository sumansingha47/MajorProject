const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//Index Callback
module.exports.index = async function (req, res) {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

//New Callback
module.exports.renderNewForm = function (req, res) {
  res.render("listings/new.ejs");
};

//Show Callback
module.exports.showListing = async function (req, res) {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  console.log(listing);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

//Create Callback
module.exports.createListing = async function (req, res, next) {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;
  let listing = req.body.listing;
  let newListing = new Listing(listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  newListing.geometry = response.body.features[0].geometry;

  let savedListing = await newListing.save();
  console.log(savedListing);
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};

//Edit Callback
module.exports.renderEditForm = async function (req, res) {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

//Update Callback
module.exports.updateListing = async function (req, res) {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

//Delete Route
module.exports.destroyListing = async function (req, res) {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};
