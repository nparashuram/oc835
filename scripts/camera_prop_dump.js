#!/usr/bin/env node

const { argv, env } = require('node:process');

const ip = argv[2]
const username = env['CAM_USERNAME'] || 'administrator';
const password = env['PASS'] || env['CAM_PASSWORD'] || '';

async function run() {
    const headers = new Headers();
    headers.set('Authorization', 'Basic ' + Buffer.from(username + ":" + password).toString('base64'));
    let data = await (await fetch(`http://${ip}/adm/get_group.cgi`, { headers })).text()
    const groups = data.replace(/[\[\]]/g, '').split('\r\n');
    for (var i = 0; i < groups.length; i++) {
        let data = await (await fetch(`http://${ip}/adm/get_group.cgi?group=${groups[i]}`, { headers })).text()
        console.log(`\r\n\r\n------\r\n[${[groups[i]]}]`)
        console.log(data.split('\r\n').slice(1).sort().join('\r\n'));
    }
};




run()
    .then(data => console.log(data))
    .catch(err => console.error(err));