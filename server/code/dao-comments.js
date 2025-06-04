const db = require('./db');
const dayjs = require('dayjs');

//--------------------------------------------------------------------------
// List all comments for a specific post, with optional user authentication
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

//--------------------------------------------------------------------------
// Add a new comment to a post
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

//--------------------------------------------------------------------------
// Edit an existing comment by ID
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

//--------------------------------------------------------------------------
// Delete a comment by ID (only if user is author or admin)
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

//--------------------------------------------------------------------------
// Get all comments for a specific post (with optional user authentication)
exports.getCommentsByPost = (postId, userId = null) => {
  return new Promise((resolve, reject) => {
    let sql;
    let params;
    
    if (userId) {
      // Authenticated user - include interesting flag
      sql = `
        SELECT c.*, u.name as author,
               CASE WHEN f.user_id IS NOT NULL THEN 1 ELSE 0 END as interesting,
               COUNT(f2.user_id) as interesting_count
        FROM comments c
        LEFT JOIN users u ON c.author_id = u.id
        LEFT JOIN comment_interesting_flags f ON c.id = f.comment_id AND f.user_id = ?
        LEFT JOIN comment_interesting_flags f2 ON c.id = f2.comment_id
        WHERE c.post_id = ?
        GROUP BY c.id, f.user_id
        ORDER BY c.timestamp DESC
      `;
      params = [userId, postId];
    } else {
      // Unauthenticated user - no interesting flag
      sql = `
        SELECT c.*, u.name as author,
               0 as interesting,
               COUNT(f.user_id) as interesting_count
        FROM comments c
        LEFT JOIN users u ON c.author_id = u.id
        LEFT JOIN comment_interesting_flags f ON c.id = f.comment_id
        WHERE c.post_id = ?
        GROUP BY c.id
        ORDER BY c.timestamp DESC
      `;
      params = [postId];
    }
    
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

//--------------------------------------------------------------------------
// Mark a comment as interesting for a specific user
exports.setInteresting = (commentId, userId) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT OR IGNORE INTO comment_interesting_flags (comment_id, user_id) VALUES (?, ?)`;
    db.run(sql, [commentId, userId], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

//--------------------------------------------------------------------------
// Remove interesting mark from a comment for a specific user
exports.unsetInteresting = (commentId, userId) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM comment_interesting_flags WHERE comment_id = ? AND user_id = ?`;
    db.run(sql, [commentId, userId], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
