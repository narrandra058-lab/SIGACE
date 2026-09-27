const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./sigace.db");

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS ELEITOR (
            ID_ELEITOR INTEGER PRIMARY KEY AUTOINCREMENT,
            NM_ELEITOR TEXT NOT NULL,
            NR_CPF TEXT,
            NR_TITULO TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS ATENDIMENTO (
            ID_ATENDIMENTO INTEGER PRIMARY KEY AUTOINCREMENT,
            ID_ELEITOR INTEGER NOT NULL,
            TP_ATENDIMENTO TEXT NOT NULL,
            ST_ATENDIMENTO TEXT NOT NULL,
            DT_ATENDIMENTO DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (ID_ELEITOR) REFERENCES ELEITOR(ID_ELEITOR)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS SERVIDOR (
            ID_SERVIDOR INTEGER PRIMARY KEY AUTOINCREMENT,
            NM_SERVIDOR TEXT NOT NULL
        )
    `);

});

module.exports = db;
