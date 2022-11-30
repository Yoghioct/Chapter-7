const express = require("express");
const { User } = require("./models");
const route = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { Strategy: JWTStrategy, ExtractJwt } = require("passport-jwt");

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: "secret"
}, async (payload, done) => {
  try {
    if (new Date() > new Date(payload.accessTokenExpiredAt)) {
      throw new Error('Access token expired!');
    }

    const user = await User.findByPk(payload.id);

    return done(null, user);
  } catch (error) {
    return done(null, false, { message: error.message });
  }
}));

route.get("/", (req, res) => {
  res.json({ success: "ok" });
});

route.post("/login", async (req, res, next) => {
  try {
    const user = await User.authenticate(req.body);
    const today = new Date();
    const accessTokenExpiredAt = today.setHours(today.getHours() + 2);
    res.json({
      accessToken: jwt.sign({
        id: user.id,
        username: user.username,
        accessTokenExpiredAt
      }, "secret"),
      accessTokenExpiredAt
    });
  } catch (error) {
    next(error);
  }
});

const allowedRoles = (roles) => (req, res, next) => {
  if (roles.includes(req.user.role)) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
};

route.get("/user",
  passport.authenticate("jwt", { session: false }),
  // allowedRoles([ "user", "admin" ]),
  (req, res) => {
    res.json(req.user);
  });

route.get("/game",
  passport.authenticate("jwt", { session: false }),
  // allowedRoles([ "admin" ]),
  (req, res) => {
    res.json(req.user);
  });

module.exports = route;