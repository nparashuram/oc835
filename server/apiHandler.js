const path = require('path');
const fs = require('fs');
const express = require("express");
const db = require('./db');
const util = require("./util");

const router = express.Router({ strict: "false" });

const { CAMERAS, DATA_DIR } = process.env
const logger = util.getLogger('apiHandler')

router.get("/cameras", (req, res, next) => {
  try {
    res.send(CAMERAS.split(' '));
  } catch (e) {
    logger.error('Could not get cameras', e)
    res.status(500).send(e.message);
  } finally {
    next();
  }
});

router.post("/videos/delete", async (req, res, next) => {
  const files = req.body;
  try {
    const result = db.softDeleteVideos(files)
    res.status(200).send({ deleted: result });
  } catch (e) {
    logger.error('Could not delete videos', e)
    res.status(500).send(e.message);
  }
  finally {
    next();
  }
});

router.get("/videos", async (req, res, next) => {
  try {
    res.json(await db.getVideos());
  }
  catch (e) {
    logger.error('Could not get video list', e)
    res.status(500).send(e.message);
  } finally {
    next();
  }
});

router.post("/upload/:cam", (req, res, next) => {
  const time = new Date();
  const camera = req.params.cam;
  const filename = path.resolve(
    DATA_DIR,
    util.getFilenameFromTime(camera, time)
  );
  logger.debug("Uploading video to " + filename);
  var wstream = fs.createWriteStream(filename);
  req.on("data", (chunk) => wstream.write(chunk));
  req.on("end", () => {
    logger.info("Finished writing video data to " + filename);
    wstream.end();
    db.addVideo(camera, time, filename);
    res.send("ok");
  });
  req.on("error", function (err) {
    logger.error("Error during HTTP upload", filename, err);
  });
  next();
});

module.exports = router;
