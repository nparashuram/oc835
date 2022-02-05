const express = require("express");
const winston = require("winston");

const expressWinston = require("express-winston");
const bodyParser = require("body-parser");

const PORT = 8080;

const healthCheck = require("./healthcheck");
const index = require("./index");
healthCheck.start();

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

app.use(index);

app.get("/videos", (_, res, next) => {
  res.redirect("/videos.html");
  next();
});

app.listen(PORT, () => {
  console.log(`Server started at  http://localhost:${PORT}`);
});
