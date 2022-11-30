const express = require("express");
const server = require("./src/app");

server(express()).listen(8000, () => {
  console.log("App is started and running at http://localhost:8000");
});