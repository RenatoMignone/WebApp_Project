const sqlite3 = require('sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../database/forum.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) throw err;
});

module.exports = db;
