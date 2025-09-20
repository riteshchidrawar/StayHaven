const User = require("../models/user.js");

module.exports.renderSignUpForm = (req, res, next) => {
  res.render("user/signup.ejs");
};

module.exports.SignUp = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const newuser = new User({ username, email });
    let registeruser = await User.register(newuser, password);
    req.login(registeruser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to StayHaven");
      res.redirect("/stayhaven");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res, next) => {
  res.render("user/login.ejs");
};

module.exports.Login = (req, res, next) => {
  req.flash("success", "Welcome back to StayHaven!");
  let redirectUrl = res.locals.redirectUrl || "/stayhaven";
  res.redirect(redirectUrl);
};

module.exports.Logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you are logged out!");
    res.redirect("/stayhaven");
  });
};
