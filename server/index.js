const path = require("path");
const fs = require("fs");

const express = require("express");
const winston = require("winston");
const serveIndex = require("serve-index");

const expressWinston = require("express-winston");
const bodyParser = require("body-parser");

const PORT = 8080;

const apiHandler = require("./apiHandler");
const config = require("./config");
const uploadHandler = require("./uploadHandler");

const app = express();
app.use(bodyParser.json());

app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf((i) => `${i.timestamp} | ${i.message}`)
    ),
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    colorize: true,
    expressFormat: true,
    statusLevels: true,
  })
);

app.use(express.static(path.join(__dirname, "../public")));

app.use("/api", apiHandler);
app.use("/upload", uploadHandler);
app.use("/raw/videos", serveIndex(config.get().dataDir, { icons: true }));
app.use("/raw/videos", express.static(config.get().dataDir));
app.use("/raw/logs", serveIndex(config.get().logDir, { icons: true }));
app.use("/raw/logs", express.static(config.get().logDir));

app.get("/videos", (_, res, next) => {
  res.redirect("/videos.html");
  next();
});

app.get("/", (_, res, next) => {
  res.redirect("/index.html");
  next();
});

app.listen(PORT, () => {
  console.log(`Server started at  http://localhost:${PORT}`);
});
