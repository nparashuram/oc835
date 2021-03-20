const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");
const http = require("http");

const router = express.Router({ strict: "false" });

const config = require("./config");
const { getTimeFromFilename } = require("./timeFilename.js");

router.get("/cameras", (req, res, next) => {
  try {
    res.send(config.get().cameras);
  } catch (e) {
    console.log(e);
    res.status(500).send(e.message);
  } finally {
    next();
  }
});

router.get("/videos", async (req, res, next) => {
  try {
    const directory = config.get().dataDir;
    fs.readdir(directory, (err, files) => {
      if (err) {
        throw new Error("e");
      }
      res.json(files.map(getTimeFromFilename));
      next();
    });
  } catch (e) {
    console.log(e);
    res.status(500).send(e.message);
    next();
  }
});

module.exports = router;
