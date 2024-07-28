const express = require("express");
const winston = require("winston");

const expressWinston = require("express-winston");
const bodyParser = require("body-parser");

const dotenv = require('dotenv')
dotenv.config()

const PORT = process.env.PORT;

const index = require("./index");
const util = require("./util");
const jobs = require("./jobs");

jobs.start()

const app = express();
const logger = util.getLogger('oc835-server');

app.use(bodyParser.json());
app.use(expressWinston.logger(logger));
app.use(index);

app.listen(PORT, () => {
  console.log(`Server started at  http://localhost:${PORT}`);
});

if (process.env.NODE_ENV === "production") {
  process.on('unhandledRejection', (reason, p) => {
    logger.error('Unhandled Rejection at Promise at process', reason, p);
  })
    .on('uncaughtException', err => {
      logger.error('Uncaught Exception thrown at process', err);
    });
}