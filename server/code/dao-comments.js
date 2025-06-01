const db = require('./db');
const dayjs = require('dayjs');

exports.listCommentsByPost = (post_id, user_id = null) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        c.id,
        c.post_id,
        c.author_id,
        u.name AS author,
        c.text,
        c.timestamp,
        (
          SELECT COUNT(*) 
          FROM comment_interesting_flags f 
          WHERE f.comment_id = c.id
        ) AS interesting_count,
        (
          SELECT EXISTS(
            SELECT 1 
            FROM comment_interesting_flags f 
            WHERE f.comment_id = c.id AND f.user_id = ?
          )
        ) AS interesting
      FROM comments c
      LEFT JOIN users u ON c.author_id = u.id
      WHERE c.post_id = ?
      ORDER BY datetime(c.timestamp) DESC
    `;
    db.all(sql, [user_id || 0, post_id], (err, rows) => {
      if (err) reject(err);
      else {
        rows.forEach(r => r.timestamp = dayjs(r.timestamp).format('YYYY-MM-DD HH:mm:ss'));
        resolve(rows);
      }
    });
  });
};

exports.addComment = (comment) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO comments (post_id, author_id, text, timestamp)
      VALUES (?, ?, ?, datetime('now'))
    `;
    db.run(sql, [comment.post_id, comment.author_id, comment.text], function (err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
  });
};

exports.editComment = (id, text, user_id, is_admin) => {
  return new Promise((resolve, reject) => {
    // Only allow if user is author or admin
    const sql = is_admin
      ? 'UPDATE comments SET text=? WHERE id=?'
      : 'UPDATE comments SET text=? WHERE id=? AND author_id=?';
    const params = is_admin ? [text, id] : [text, id, user_id];
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this.changes);
    });
  });
};

exports.deleteComment = (id, user_id, is_admin) => {
  return new Promise((resolve, reject) => {
    // Only allow if user is author or admin
    const sql = is_admin
      ? 'DELETE FROM comments WHERE id=?'
      : 'DELETE FROM comments WHERE id=? AND author_id=?';
    const params = is_admin ? [id] : [id, user_id];
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this.changes);
    });
  });
};
