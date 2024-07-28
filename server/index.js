const path = require("path");
const express = require("express");

const serveIndex = require("serve-index");
const apiHandler = require("./apiHandler");

const { DATA_DIR, LOG_DIR } = process.env
if (DATA_DIR == null || LOG_DIR == null) {
  throw new Error("Environment variables DATA_DIR or LOG_DIR not found");
}

const router = express.Router();

router.use(express.static(path.join(__dirname, "../public")));
router.use("/api", apiHandler);
router.use("/raw/videos", serveIndex(DATA_DIR, { icons: true }));
router.use("/raw/videos", express.static(DATA_DIR));
router.use("/raw/logs", serveIndex(LOG_DIR, { icons: true }));
router.use("/raw/logs", express.static(LOG_DIR));

router.get("/videos", (_, res, next) => {
  res.redirect("videos.html");
  next();
});

router.get("/", (_, res, next) => {
  res.redirect("/index.html");
  next();
});

module.exports = router;
