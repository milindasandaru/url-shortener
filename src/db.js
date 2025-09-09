const fs = require('fs');
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

class Database {
    constructor() {
        if (Database.instance) return Database.instance;

        const inMemory = process.env.DB_IN_MEMORY === "true";
        const dataDir = path.join(process.cwd(), "data");

        if (!inMemory) {
            if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
        }



        const dbPath = inMemory ? ":memory:" : path.join(dataDir, "urls.db");
        this.db = new sqlite3.Database(dbpath);

        this.db.serialize(() => {
            this.db.run(`
            CREATE TABLE IF NOT EXISTS urls (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                code TEXT UNIQUE NOT NULL,
                url TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
            this.db.run(`CREATE INDEX IF NOT EXIST idx_urls_code ON urls(code)`);
        });

        Database.instance = this;

    }

    getConnection() {
        return this.db;
    }
}

module.exports = new Database();