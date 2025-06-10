const sqlite3 = require('sqlite3');

//----------------------------------------------------------------------------
const db = new sqlite3.Database('./database/forum.sqlite', (err) => {
  if (err) throw err;
});

//----------------------------------------------------------------------------
module.exports = db;
