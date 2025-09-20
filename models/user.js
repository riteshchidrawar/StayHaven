const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PassportLocalMongoose = require("passport-local-mongoose");

const userschema = new Schema({
  email: {
    type: String,
  },
});

userschema.plugin(PassportLocalMongoose);

const User = mongoose.model("User", userschema);

module.exports = User;