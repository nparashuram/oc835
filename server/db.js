const sqlite3 = require('sqlite3');
const path = require('path');
const fs = require('fs');

const dotenv = require('dotenv');
dotenv.config();

const timeFilename = require('./util');
const util = require('./util');

const { DATA_DIR } = process.env

async function withDB(callback) {
    return new Promise((resolve, reject) => {
        if (!DATA_DIR) {
            reject(new Error("Data Directory not defined, so cannot create a database"))
            return
        }
        const db = new sqlite3.Database(path.join(DATA_DIR, 'security.db'), err => {
            if (err) {
                reject(err)
            } else {
                try {
                    callback(db, function (err, res) {
                        db.close()
                        err ? reject(err) : resolve(res)
                    });
                } catch (e) {
                    reject(e);
                }
            }
        });
    })
}

const initialize = async () => withDB((db, cb) =>
    db.run(`CREATE TABLE videos (
            camera TEXT NOT NULL,
            time DATETIME NOT NULL,
            file TEXT NOT NULL,
            is_synced BOOLEAN DEFAULT FALSE,
            is_deleted BOOLEAN DEFAULT FALSE,
            PRIMARY KEY (file)
        )`, cb)
);

const hydrate = async () => withDB((db, cb) =>
    fs.readdir(DATA_DIR, (err, files) => {
        if (err) {
            cb(err, null);
        }
        const values = files.reduce((acc, filename) => {
            const { camera, time, file } = timeFilename.getTimeFromFilename(filename);
            return isNaN(time) ? acc : `${acc},\n ('${camera}' , ${time}, '${file}')`
        }, '').substring(1);
        const sql = `INSERT INTO videos (camera, time, file) VALUES ${values}`;
        db.run(sql, cb);
    })
);

const dropDatabase = async () => withDB((db, cb) => {
    db.run('DROP TABLE videos', cb)
});

const refreshDatabase = async () => {
    await dropDatabase();
    await initialize();
    await hydrate()
};

const getVideos = async () => withDB((db, cb) => {
    db.all('SELECT file from videos where NOT is_deleted ORDER BY time DESC LIMIT 10000', (err, rows) => {
        if (err) {
            cb(err, null);
        } else {
            cb(null, rows.map(row => row.file));
        }
    })
});

const getDeletedVideos = async () => withDB((db, cb) => {
    db.all('SELECT file from videos where is_deleted ORDER BY time', (err, rows) => {
        if (err) {
            cb(err, null);
        } else {
            cb(null, rows.map(row => row.file));
        }
    })
});

const deleteVideo = async (file) => withDB((db, cb) => {
    const sql = `DELETE FROM videos where file == '${file}';`
    db.run(sql, cb);
});

const softDeleteVideos = async (files) => withDB((db, cb) => {
    const sql = `UPDATE videos SET is_deleted = TRUE where (file) in (VALUES ${files.map(file => `('${file}')`).join(',')});`
    db.run(sql, cb);
});

const addVideo = async (file) => withDB((db, cb) => {
    const { camera, time } = util.getTimeFromFilename(file);
    const sql = `INSERT INTO videos (camera, time, file) VALUES ('${camera}' , ${time}, '${file}')`;
    db.run(sql, cb);
});

module.exports = {
    addVideo,
    softDeleteVideos,
    deleteVideo,
    getDeletedVideos,
    getVideos,
    dropDatabase,
    hydrate,
    initialize, refreshDatabase
};
