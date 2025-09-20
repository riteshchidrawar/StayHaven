if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const router = express.Router({ mergeParams: true });
const WrapAsync = require("../utils/wrapAsync.js");
const { isLoggedin, isOwner, listingvalidator } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(WrapAsync(listingController.index))
  .post(
    isLoggedin,
    upload.single("image"), 
    listingvalidator,
    WrapAsync(listingController.CreateListing)
  );

router.get("/new", isLoggedin, listingController.renderNewForm);

router
  .route("/:id")
  .get(WrapAsync(listingController.showlisting))
  .patch(
    isLoggedin,
    isOwner,
    upload.single("image"),
    listingvalidator,
    WrapAsync(listingController.UpdateListing)
  )
  .delete(isLoggedin, isOwner, WrapAsync(listingController.DeleteListing));

router.get(
  "/:id/edit",
  isLoggedin,
  isOwner,
  WrapAsync(listingController.renderEditForm)
);

module.exports = router;
