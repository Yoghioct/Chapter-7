const express = require("express");
const passport = require("passport");
const route = express.Router();
const { User } = require("./models");
const LocalStrategy = require("passport-local");
const { isAuthenticated } = require("./utils/middleware");

route.get("/", (req, res) => {
  res.render("home");
});

route.get("/register", (req, res) => {
  res.render("register", { status: 200 });
});

route.post("/register", async (req,res) => {
  const { name, username, password } = req.body;

  if(!name || !username || !password) {
    res.render("register", {
      status: 500
    });
  } else {
    await User.register({ name, username, password });

    res.redirect("login");
  }
});

route.get("/login", (req, res) => {
  if (req.isAuthenticated()) return res.redirect("/user");

  res.render("login");
});

passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.authenticate({ username, password });

    return done(null, user);
  } catch (error) {
    return done(null, false, { message: error.message });
  }
}));

passport.serializeUser(async (user, done) => {
  const { id, username } = await user;
  done(null, { id, username });
});

passport.deserializeUser(async (user, done) => {
  done(null, await user);
});

route.post("/login", passport.authenticate('local', {
  successReturnToOrRedirect: '/user',
  failureRedirect: '/login',
  failureMessage: true
}));

route.get("/user", isAuthenticated, (req, res) => {
  console.log(req.user);
  res.render("user", { username: req.user.username });
});

route.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    res.redirect("/");
  });
});

module.exports = route;