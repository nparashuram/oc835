const deleteVideos = require("./deletevideos");
const healthCheck = require("./healthcheck");

const jobs = [healthCheck, deleteVideos]

module.exports = {
    start() {
        jobs.forEach(job => job.start());
    },

    stop() {
        jobs.forEach(job => (typeof job.stop === 'function') && job.stop());
    }
}


