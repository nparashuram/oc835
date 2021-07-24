#!/usr/bin/env node

const http = require("http");

const fetch = (url) =>
  new Promise((resolve, reject) => {
    http
      .get(url, (resp) => {
        let data = "";
        resp.on("data", (chunk) => {
          data += chunk;
        });
        resp.on("end", () => {
          resolve(data.split(/\r*\n/));
        });
      })
      .on("error", (err) => reject(err));
  });

async function run({ ip, username, password }) {
  username = username || "administrator";
  password = password || "";
  const credentials = `${username}:${password}@`;
  const groups = await fetch(`http://${credentials}${ip}/adm/get_group.cgi`);
  const data = {};
  for (let i = 0; i < groups.length; i++) {
    if (groups[i]) {
      const group = groups[i].replace(/[\[\]]/g, "");
      const props = await fetch(`http://${credentials}${ip}/adm/get_group.cgi?group=${group}`);
      data[group] = props.map((prop) => prop.split(/=(.+)/)).reduce((acc, [key, val]) => ({ ...acc, [val != null ? key : ""]: val }), {});
    }
  }
  return data;
}

if (require.main === module) {
  const ip = process.argv[2];
  if (ip) {
    run({ ip, password: process.argv[3], username: process.argv[4] })
      .then((res) => console.log(res))
      .catch((e) => console.log(e));
  } else {
    console.error("Specific an IP as an arg to this script");
  }
}
module.exports = run;
