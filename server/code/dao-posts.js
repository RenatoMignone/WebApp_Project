const db = require('./db');
const dayjs = require('dayjs');

exports.listPosts = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        p.id, 
        p.title, 
        p.author_id, 
        u.name AS author, 
        p.text, 
        p.max_comments, 
        p.timestamp,
        COUNT(c.id) AS comments_count
      FROM posts p
      JOIN users u ON p.author_id = u.id
      LEFT JOIN comments c ON c.post_id = p.id
      GROUP BY p.id
      ORDER BY datetime(p.timestamp) DESC
    `;
    db.all(sql, [], (err, rows) => {
      if (err) reject(err);
      else {
        rows.forEach(r => r.timestamp = dayjs(r.timestamp).format('YYYY-MM-DD HH:mm:ss'));
        resolve(rows);
      }
    });
  });
};

exports.getPostById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        p.id, 
        p.title, 
        p.author_id, 
        u.name AS author, 
        p.text, 
        p.max_comments, 
        p.timestamp,
        COUNT(c.id) AS comments_count
      FROM posts p
      JOIN users u ON p.author_id = u.id
      LEFT JOIN comments c ON c.post_id = p.id
      WHERE p.id = ?
      GROUP BY p.id
    `;
    db.get(sql, [id], (err, row) => {
      if (err) reject(err);
      else if (row) row.timestamp = dayjs(row.timestamp).format('YYYY-MM-DD HH:mm:ss');
      resolve(row);
    });
  });
};

exports.addPost = (post) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO posts (title, author_id, text, max_comments, timestamp)
      VALUES (?, ?, ?, ?, datetime('now'))
    `;
    db.run(sql, [post.title, post.author_id, post.text, post.max_comments], function (err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
  });
};

exports.deletePost = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM posts WHERE id=?';
    db.run(sql, [id], function (err) {
      if (err) reject(err);
      else resolve(this.changes);
    });
  });
};
