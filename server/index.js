const path = require("path");
const fs = require("fs");
const express = require("express");

const healthCheck = require("./healthcheck");
healthCheck.start();

const serveIndex = require("serve-index");
const apiHandler = require("./apiHandler");
const config = require("./config");
const uploadHandler = require("./uploadHandler");

const router = express.Router();
router.use(express.static(path.join(__dirname, "../public")));

router.use("/api", apiHandler);
router.use("/upload", uploadHandler);
router.use("/raw/videos", serveIndex(config.get().dataDir, { icons: true }));
router.use("/raw/videos", express.static(config.get().dataDir));
router.use("/raw/logs", serveIndex(config.get().logDir, { icons: true }));
router.use("/raw/logs", express.static(config.get().logDir));

router.get("/videos", (_, res, next) => {
  res.redirect("videos.html");
  next();
});

router.get("/", (_, res, next) => {
  res.redirect("/index.html");
  next();
});

module.exports = router;
