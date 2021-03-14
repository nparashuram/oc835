const path = require("path");
const fs = require("fs");

const express = require("express");
const winston = require("winston");
const serveIndex = require("serve-index");

const expressWinston = require("express-winston");

const PORT = 8080;

const apiHandler = require("./apiHandler");
const config = require("./config");
const uploadHandler = require("./uploadHandler");

const app = express();

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
app.use("/videos", serveIndex(config.get().dataDir, { icons: true }));
app.use("/videos", express.static(config.get().dataDir));

app.get("/", (_, res, next) => {
  res.redirect("/index.html");
  next();
});

app.listen(PORT, () => {
  console.log(`Server started at  http://localhost:${PORT}`);
});
