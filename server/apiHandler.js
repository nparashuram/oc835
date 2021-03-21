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

const unlink = util.promisify(fs.unlink);

router.post("/videos/delete", async (req, res, next) => {
  const files = req.body;
  if (Array.isArray(files)) {
    Promise.allSettled(
      files.map((file) => unlink(path.resolve(config.get().dataDir, file)))
    ).then((values) => {
      const result = values.reduce(
        (acc, cur, i) => ({
          ...acc,
          [cur.status]: [...acc[cur.status], files[i]],
        }),
        {
          rejected: [],
          fulfilled: [],
        }
      );
      res.json(result);
    });
  } else {
    res.status(500).send("List of files should be an array");
  }
});

router.get("/videos", async (req, res, next) => {
  try {
    const directory = config.get().dataDir;
    fs.readdir(directory, (err, files) => {
      if (err) {
        throw new Error("e");
      }
      console.log(files);
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
