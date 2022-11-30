const express = require("express");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const route = require("./route");
const routeApi = require("./route-api");

const server = (app) => {
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "ejs");

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(express.static("public"));
  
  app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(route);
  app.use("/api", routeApi);

  return app;
}

module.exports = server;