const winston = require('winston');
require('winston-daily-rotate-file');

const dotenv = require('dotenv');
dotenv.config();

const PROD = process.env.NODE_ENV === "production";
const { LOG_DIR } = process.env

const consoleFormat = {
  transform(info) {
    const { message, level, label, timestamp } = info;
    console[level === "error" ? "error" : "log"](`${timestamp} OC835 [${label}]`, Array.isArray(message) ? message.join(" ") : message);
    return false;
  },
};

const logFormat = winston.format.printf(({ level, message, label, timestamp }) => {
  return `${timestamp} OC835 [${label}] ${level}: ${Array.isArray(message) ? message.join(" ") : message}`;
});


module.exports = {
  getFilenameFromTime(text = "cam0", date = new Date()) {
    const ts = new Intl.DateTimeFormat("en-us", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: 'h23'
    })
      .formatToParts(date)
      .reduce((acc, i) => ({ ...acc, [i.type]: i.value }), {});
    return `${text}-${ts.year}-${ts.month}-${ts.day}__${ts.hour}-${ts.minute}-${ts.second}.mp4`;
  },

  getTimeFromFilename(file) {
    const [camera, year, month, date, _, hour, min, sec] = file.split(/[-_\.]/);
    const time = new Date();
    time.setFullYear(year);
    time.setMonth(parseInt(month) - 1);
    time.setDate(date);
    time.setHours(hour);
    time.setMinutes(min);
    time.setSeconds(sec);

    return { camera, time: time.getTime(), file };
  },

  getLogger(label) {
    return winston.createLogger({
      level: PROD ? "info" : "debug",
      format: winston.format.combine(winston.format.label({ label }), winston.format.timestamp(), PROD ? logFormat : consoleFormat),
      transports: PROD
        ? [
          new winston.transports.DailyRotateFile({
            filename: 'app-%DATE%.log',
            datePattern: "YYYY-MM-DD-HH",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "14d",
            dirname: process.env.LOG_DIR,
          }),
        ]
        : [new winston.transports.Console()],
    });
  }
};

