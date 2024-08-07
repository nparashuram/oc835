const path = require('path');
const fs = require('fs');
const express = require("express");
const db = require('./db');
const util = require("./util");

const router = express.Router({ strict: "false" });

const { CAMERAS, DATA_DIR } = process.env
const logger = util.getLogger('apiHandler')

router.get("/cameras", (_, res) => {
  try {
    res.send(CAMERAS.split(' '));
  } catch (e) {
    logger.error('Could not get cameras', e)
    res.status(500).send(e.message);
  }
});

router.post("/videos/delete", async (req, res) => {
  const files = req.body;
  try {
    const result = db.softDeleteVideos(files)
    res.status(200).send({ deleted: result });
  } catch (e) {
    logger.error('Could not delete videos', e)
    res.status(500).send(e.message);
  }
});

router.get("/videos", async (_, res) => {
  try {
    res.json(await db.getVideos());
  }
  catch (e) {
    logger.error('Could not get video list', e)
    res.status(500).send(e.message);
  }
});

router.post("/upload/:cam", (req, res, next) => {
  const file = util.getFilenameFromTime(req.params.cam, new Date())
  logger.debug("Uploading video to " + file);
  var wstream = fs.createWriteStream(path.resolve(DATA_DIR, file));
  req.on("data", (chunk) => wstream.write(chunk));
  req.on("end", () => {
    logger.info("Finished writing video data to " + file);
    wstream.end();
    db.addVideo(file).then(() => {
      res.send("ok");
    }).catch(e => {
      logger.error('Could not upload video', e)
      res.status(500).send(e.message);
    });
  });

  req.on("error", function (err) {
    logger.error("Error during HTTP upload", filename, err);
    next();
  });
});

module.exports = router;
