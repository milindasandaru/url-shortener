const fs = require('fs');
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

class Database {
    constructor() {
        if (Database.instance) return Database.instance;

        const inMemory = process.env.DB_IN_MEMORY === "true";
        const dataDir = path.join(process.cwd(), "data");

        if(!inMemory) {
            if(!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, {recursive:true});
        }
    }
}