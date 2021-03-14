const fs = require("fs");
const path = require("path");

const CONFIG_FILE = path.join(__dirname, "../.config.json");
const CONFIG_FILE_TEMPLATE = path.join(__dirname, "../config.sample.json");

let config = null;
function initializeConfig() {
  if (!fs.existsSync(CONFIG_FILE)) {
    fs.copyFileSync(CONFIG_FILE_TEMPLATE, CONFIG_FILE);
  }
  const buf = fs.readFileSync(CONFIG_FILE);
  const config = JSON.parse(buf);
  if (!fs.existsSync(config.dataDir)) {
    fs.mkdirSync(config.dataDir, { recursive: true });
  }

  if (!fs.existsSync(config.logDir)) {
    fs.mkdirSync(config.logDir, { recursive: true });
  }
  return config;
}

module.exports = {
  get() {
    if (!config) {
      console.log("Initializing Config ... ");
      config = initializeConfig();
    }
    return config;
  },
};
