const fs = require('fs')
const path = require('path')

const db = require("../db");
const util = require("../util");
const logger = util.getLogger('DeleteVideos-Job');

const { DATA_DIR } = process.env;

const deleteFile = async (file) => new Promise((resolve, reject) => {
    fs.unlink(path.resolve(DATA_DIR, file), (err, val) => {
        if (err) { reject(err) }
        else { resolve(val) }
    })
})

function run(interval) {
    new Promise(async (resolve, reject) => {
        try {
            const files = await db.getDeletedVideos();
            logger.info(`Hard deleting ${files.length} videos.`)
            for (var i = 0; i < files.length; i++) {
                var file = files[i]
                console.log("Deleted ", file)
                await deleteFile(file);
                await db.deleteVideo(file);

            }
            resolve();
        } catch (e) {
            logger.error('Could not get deleted files', e)
            reject(e)
        }
    }).catch(e => logger.error('Could not get deleted files', e))
        .finally(() => {
            setTimeout(function () {
                runCheck(interval);
            }, interval);
        })
}

module.exports = {
    start(interval) {
        run(interval || 1000 * 60 * 30); // Deleting video every 30 mins
    }
};
