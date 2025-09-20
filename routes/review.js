const express = require("express");
const router = express.Router({ mergeParams: true });
const WrapAsync = require("../utils/wrapAsync.js");
const { reviewvalidator, isLoggedin, isReviewAuthor } = require("../middleware.js");
const ReviewController = require("../controllers/review.js");


// New Review
router.post("/:id/reviews", isLoggedin, reviewvalidator, WrapAsync(ReviewController.CreateReview));

// Delete Review
router.get("/:listingid/reviews/:reviewid", isLoggedin, isReviewAuthor, WrapAsync(ReviewController.DeleteReview));

module.exports = router;
