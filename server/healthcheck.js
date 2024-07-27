const path = require("path");
const winston = require("winston");
const https = require("https");

const { HEALTHCHECK_URL, HEALTHCHECK_INTERVAL, LOG_DIR } = process.env;

if (!HEALTHCHECK_URL || !HEALTHCHECK_INTERVAL) {
  throw new Error("Environment Variables not defined for HEALTHCHECK_URL or HEALTHCHECK_URL_INTERVAL")
}

const logger = winston.createLogger({
  level: "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf((i) => `${i.timestamp} | ${i.message}`)
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(LOG_DIR, "healthchecks.log"),
    }),
  ],
});

function start(interval) {
  interval = interval || 1000 * 60 * HEALTHCHECK_INTERVAL || 1000 * 60 * 30; // 0.5 hour
  logger.info("[HealthCheck] Pinging URL at " + HEALTHCHECK_URL + " every " + HEALTHCHECK_INTERVAL + " minutes ");
  runCheck(interval);
}

function runCheck(interval) {
  const req = https.request(HEALTHCHECK_URL, (res) => {
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
