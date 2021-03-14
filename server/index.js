const path = require("path");
const fs = require("fs");

const express = require("express");
const winston = require("winston");
const expressWinston = require("express-winston");

const PORT = 8080;

const apiHandler = require("./apiHandler");
const config = require("./config");
const uploadHandler = require("./uploadHandler");

const app = express();

app.use(
  expressWinston.logger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: path.join(config.get().logDir, "http.log"),
      }),
    ],
    format: winston.format.combine(winston.format.json()),
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    expressFormat: true,
  })
);

app.use(express.static(path.join(__dirname, "../public")));
app.use("/api", apiHandler);
app.use("/upload", uploadHandler);

app.get("/", (_, res, next) => {
  res.redirect("/index.html");
  next();
});

app.listen(PORT, () => {
  console.log(`Server started at  http://localhost:${PORT}`);
});
