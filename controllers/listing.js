const { query } = require("express");
const listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res, next) => {
  let Alllist = await listing.find({});
  res.render("listings/list.ejs", { Alllist });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showlisting = async (req, res, next) => {
  const list = await listing
    .findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!list) {
    req.flash("error", "Haven you requested for does not exits!");
    res.redirect("/stayhaven");
  }
  res.render("listings/show.ejs", { list });
};

module.exports.CreateListing = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;
  const newlist = new listing(req.body);
  newlist.owner = req.user._id;
  newlist.image = { url, filename };
  newlist.geometry = response.body.features[0].geometry;
  let savedlist = await newlist.save();
  req.flash("success", "New Haven Created");
  res.redirect("/stayhaven");
};

module.exports.renderEditForm = async (req, res, next) => {
  const list = await listing.findById(req.params.id);
  if (!list) {
    req.flash("error", "Haven you requested for does not exits!");
    res.redirect("/stayhaven");
  }
  let originalImageUrl = list.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_150");
  res.render("listings/edit.ejs", { list, originalImageUrl });
};

module.exports.UpdateListing = async (req, res, next) => {
  let list = await listing.findByIdAndUpdate(req.params.id, req.body);
  if (typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    list.image = { url, filename };
  }
  await list.save();
  req.flash("success", "Haven Details Updated!");
  res.redirect(`/stayhaven/${req.params.id}`);
};

module.exports.DeleteListing = async (req, res, next) => {
  await listing.findByIdAndDelete(req.params.id);
  req.flash("success", "Hotel Deleted!");
  res.redirect("/stayhaven");
};
