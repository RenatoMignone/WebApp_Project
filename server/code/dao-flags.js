'use strict';

const db = require('./db');

/**
 * Add an interesting flag to a comment
 */
exports.addFlag = (userId, commentId) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO flags (user_id, comment_id) VALUES (?, ?)';
    
    db.run(sql, [userId, commentId], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID });
      }
    });
  });
};

/**
 * Remove an interesting flag from a comment
 */
exports.removeFlag = (userId, commentId) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM flags WHERE user_id = ? AND comment_id = ?';
    
    db.run(sql, [userId, commentId], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ changes: this.changes });
      }
    });
  });
};

/**
 * Check if a user has flagged a comment as interesting
 */
exports.hasFlag = (userId, commentId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM flags WHERE user_id = ? AND comment_id = ?';
    
    db.get(sql, [userId, commentId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(!!row);
      }
    });
  });
};

/**
 * Get all flags for a comment
 */
exports.getFlagsForComment = (commentId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM flags WHERE comment_id = ?';
    
    db.all(sql, [commentId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};
