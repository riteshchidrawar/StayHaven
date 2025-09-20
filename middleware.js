const listing = require("./models/listing");
const review = require("./models/reviews.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be logged in to create Haven account.");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveredirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let list = await listing.findById(req.params.id);
  if (!list.owner.equals(res.locals.currentUser._id)) {
    req.flash("error", "you are not the owner of this Haven !");
    return res.redirect(`/stayhaven/${req.params.id}`);
  }
  next();
};


module.exports.listingvalidator = (req, res, next) => {
  let result = listingSchema.validate(req.body);
  if (result.error) {
    let errmsg = result.error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errmsg);
  } else {
    next();
  }
};

module.exports.reviewvalidator = (req, res, next) => {
  let result = reviewSchema.validate(req.body);
  if (result.error) {
    let errmsg = result.error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errmsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { reviewid, listingid } = req.params;
  let Review = await review.findById(reviewid);
  if (!Review.author.equals(res.locals.currentUser._id)) {
    req.flash("error", "you are not the created this review !");
    return res.redirect(`/stayhaven/${listingid}`);
  }
  next();
};