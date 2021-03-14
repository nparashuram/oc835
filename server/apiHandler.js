const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");
const http = require("http");

const router = express.Router({ strict: "false" });

const config = require("./config");

router.get("/cameras", async (req, res, next) => {
  try {
    res.send(config.get().cameras);
  } catch (e) {
    console.log(e);
    res.status(500).send(e.message);
  } finally {
    next();
  }
});

module.exports = router;
