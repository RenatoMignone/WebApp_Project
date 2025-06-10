const db = require('../db');
const dayjs = require('dayjs');

//----------------------------------------------------------------------------
// List all posts with author information and comment counts
exports.listPosts = () => {
  return new Promise((resolve, reject) => {

    // SQL query to get all posts with author name and comment counts
    // We have the JOIN with the users table to get the author's name
    // We use LEFT JOIN with comments to count the number of comments per post
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

//----------------------------------------------------------------------------
// Get a single post by ID with author information and comment counts
exports.getPostById = (id) => {
  return new Promise((resolve, reject) => {

    // SQL query to get a single post by ID with author name and comment counts
    // We have the JOIN with the users table to get the author's name
    // We use LEFT JOIN with comments to count the number of comments for the post
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

//----------------------------------------------------------------------------
// Add a new post
exports.addPost = (post) => {
  return new Promise((resolve, reject) => {
    // First check if title already exists
    const checkSql = 'SELECT id FROM posts WHERE title = ?';
    db.get(checkSql, [post.title], (err, row) => {
      if (err) {
        reject(err);
      } else if (row) {
        reject(new Error('A post with this title already exists'));
      } else {
        const maxComments = post.max_comments === 0 ? 0 : (post.max_comments || null);
        const sql = 'INSERT INTO posts (title, text, author_id, max_comments) VALUES (?, ?, ?, ?)';
        db.run(sql, [post.title, post.text, post.author_id, maxComments], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        });
      }
    });
  });
};

//----------------------------------------------------------------------------
// Delete a post by ID (with cascading deletes for comments and flags)
exports.deletePost = (id) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // First delete all interesting flags for comments in this post
      db.run(`
        DELETE FROM comment_interesting_flags 
        WHERE comment_id IN (
          SELECT id FROM comments WHERE post_id = ?
        )
      `, [id], function(err) {
        if (err) return reject(err);
        
        // Then delete all comments for this post
        db.run("DELETE FROM comments WHERE post_id = ?", [id], function(err) {
          if (err) return reject(err);
          
          // Finally delete the post itself
          db.run("DELETE FROM posts WHERE id = ?", [id], function(err2) {
            if (err2) reject(err2);
            else resolve(this.changes);
          });
        });
      });
    });
  });
};
