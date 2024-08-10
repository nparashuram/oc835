const https = require("https");
const util = require("../util");

const { HEALTHCHECK_URL, HEALTHCHECK_INTERVAL } = process.env;

if (!HEALTHCHECK_URL || !HEALTHCHECK_INTERVAL) {
  throw new Error("Environment Variables not defined for HEALTHCHECK_URL or HEALTHCHECK_INTERVAL")
}

const logger = util.getLogger('healthCheck')


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

module.exports = {
  start(interval) {
    logger.info("[HealthCheck] Pinging URL at " + HEALTHCHECK_URL + " every " + HEALTHCHECK_INTERVAL + " minutes ");
    runCheck(interval || 1000 * 60 * parseInt(HEALTHCHECK_INTERVAL || 30));
  }
};
