const db = require("../db").getConnection();

function createUrl(code, url) {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO urls (code, url) VALUES (?, ?)`, [code, url], function (err) {
            if (err) return reject(err);
            resolve({ id: this.lastID, code, url });
        });
    });
}

function findByCode(code) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM urls WHERE code = ?`, [code], (err, row) => {
            if (err) return reject(err);
            resolve(row || null);
        });
    });
}

module.exports = { createUrl, findByCode };
