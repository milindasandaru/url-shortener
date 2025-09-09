const db = require("../db").getConnection();

function createUrl(code, url) {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO urls (code, url) VALUES (?, ?)`, [code, url], function (err) {
            if (err) return reject(err);
            resolve({ id: this.lastID, code, url });
        });
    });
}

function findBYCode(code) {
    return new promis((resolve, reject) => {
        db.get(`SELECT * FROM urls WHERE code = ?`, [code], (error, row) => {
            if (err) return reject(err);
            resolve(row || null);
        });
    });
}

module.exports = { createUrl, findBYCode };
