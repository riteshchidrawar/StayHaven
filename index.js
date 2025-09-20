const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const path = require("path");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate);

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");

const userRouter = require("./routes/user.js");
const { log } = require("console");
const listing = require("./models/listing.js");

// const Airbnb = "mongodb://127.0.0.1:27017/Airbnb";

const dburl = process.env.ATLASDB_URL;

// mongoose conncetion
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(dburl);
  console.log("connected to mongoose");
}

const store = MongoStore.create({
  mongoUrl: dburl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("error in store", err);
});

const sessionoptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookies: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, // for cross scripting attacks
  },
};

app.use(session(sessionoptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.successmsg = req.flash("success");
  res.locals.errormsg = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

app.get("/search", async (req, res) => {
  try {
    let searchlist = await listing.find({
      $or: [
        {
          title: { $regex: req.query.key, $options: "i" },
        },
      ],
    });

    res.render("listings/searchlist.ejs", { searchlist });
  } catch (error) {}
});

app.use("/stayhaven", listingRouter);
app.use("/stayhaven", reviewRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found !"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "page not found" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(3000, () => {
  console.log("server is listening");
});
