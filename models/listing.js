const mongoose = require("mongoose");
const review = require("./reviews.js");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "review",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
});

// for deleting the review in review collections when delete the listing
listingSchema.post("findOneAndDelete", async (list) => {
  if (list) {
    await review.deleteMany({ _id: { $in: list.reviews } });
  }
});

const listing = mongoose.model("listing", listingSchema);

module.exports = listing;
