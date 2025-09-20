const review = require("../models/reviews.js");
const listing = require("../models/listing.js");

module.exports.CreateReview = async (req, res, next) => {
  let id = req.params.id;
  let listings = await listing.findById(id);
  let newreview = new review(req.body);
  newreview.author = req.user._id;
  listings.reviews.push(newreview);
  await newreview.save();
  await listings.save();

  req.flash("success", "Review Added!");
  res.redirect(`/stayhaven/${id}`);
};

module.exports.DeleteReview = async (req, res, next) => {
  let { listingid, reviewid } = req.params;
  await listing.findByIdAndUpdate(listingid, {
    $pull: { reviews: reviewid },
  });
  await review.findByIdAndDelete(reviewid);
  req.flash("success", "Deleted Review!");
  res.redirect(`/stayhaven/${listingid}`);
};
