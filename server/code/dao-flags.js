const db = require('./db');

exports.addFlag = (user_id, comment_id) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT OR IGNORE INTO comment_interesting_flags (user_id, comment_id)
      VALUES (?, ?)
    `;
    db.run(sql, [user_id, comment_id], function (err) {
      if (err) reject(err);
      else resolve(this.changes);
    });
  });
};

exports.removeFlag = (user_id, comment_id) => {
  return new Promise((resolve, reject) => {
    const sql = `
      DELETE FROM comment_interesting_flags
      WHERE user_id = ? AND comment_id = ?
    `;
    db.run(sql, [user_id, comment_id], function (err) {
      if (err) reject(err);
      else resolve(this.changes);
    });
  });
};
