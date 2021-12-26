const path = require("path");
const winston = require("winston");
const https = require("https");

const config = require("./config");
const URL = config.get().healthcheckUrl;
console.log(config.get());

const logger = winston.createLogger({
  level: "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf((i) => `${i.timestamp} | ${i.message}`)
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(config.get().logDir, "healthchecks.log"),
    }),
  ],
});

function start(interval) {
  interval = interval || 1000 * 60 * 60; // 1 hour
  logger.info("[HealthCheck] Pinging URL at ", URL);
  runCheck(interval);
}

function runCheck(interval) {
  const req = https.request(URL, (res) => {
    logger[res.statusCode === 200 ? "debug" : "info"]("[HealthCheck] Got response from ping", res.statusCode);
  });

  req.on("error", (error) => {
    logger.error(error);
  });

  req.end();
  setTimeout(function () {
    runCheck(interval);
  }, interval);
}

module.exports = { start };
