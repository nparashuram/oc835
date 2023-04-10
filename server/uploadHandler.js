const path = require("path");
const fs = require("fs");

const express = require("express");
const winston = require("winston");

const { getFilenameFromTime } = require("./timeFilename");

const config = require("./config");
const logger = winston.createLogger({
  level: "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf((i) => `${i.timestamp} | ${i.message}`)
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(config.get().logDir, "error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(config.get().logDir, "upload.log"),
    }),
  ],
});

const router = express.Router({ strict: "false" });

router.post("/:cam", (req, res, next) => {
  const filename = path.join(
    config.get().dataDir,
    getFilenameFromTime(req.params.cam, new Date())
  );
  logger.debug("Uploading video to " + filename);
  var wstream = fs.createWriteStream(filename);
  req.on("data", (chunk) => wstream.write(chunk));
  req.on("end", () => {
    logger.info("Finished writing video data to " + filename);
    wstream.end();
    res.send("ok");
  });
  req.on("error", function (err) {
    logger.error("Error during HTTP upload", err);
  });
});

module.exports = router;
