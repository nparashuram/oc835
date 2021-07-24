const express = require("express");
const path = require("path");
const fs = require("fs");

const router = express.Router({ strict: "false" });

const config = require("./config");
const cameraConfig = require("./cameraConfig");

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

router.get("/camera/:ip", (req, res, next) => {
  cameraConfig({ ...req.params, ...req.query })
    .then((config) => {
      res.send(config);
      next();
    })
    .catch((e) => {
      res.status(500).send("Could not get camera configs");
      next();
    });
});

router.post("/videos/delete", async (req, res, next) => {
  const files = req.body;
  if (Array.isArray(files)) {
    files.forEach((file) => fs.unlinkSync(path.resolve(config.get().dataDir, file)));
    res.status(200).send({ deleted: files.length });
    next();
  } else {
    res.status(500).send("List of files should be an array");
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
