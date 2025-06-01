PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  username   TEXT    NOT NULL UNIQUE,
  name       TEXT    NOT NULL,
  hash       TEXT    NOT NULL,
  salt       TEXT    NOT NULL,
  is_admin   INTEGER NOT NULL DEFAULT 0,
  otp_secret TEXT
);

CREATE TABLE IF NOT EXISTS posts (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  title        TEXT    NOT NULL UNIQUE,
  author_id    INTEGER NOT NULL,
  text         TEXT    NOT NULL,
  max_comments INTEGER,
  timestamp    TEXT    NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY(author_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS comments (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id   INTEGER NOT NULL,
  author_id INTEGER,
  text      TEXT    NOT NULL,
  timestamp TEXT    NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY(author_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS comment_interesting_flags (
  user_id    INTEGER NOT NULL,
  comment_id INTEGER NOT NULL,
  PRIMARY KEY(user_id, comment_id),
  FOREIGN KEY(user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE
);

-- Insert 5 users (2 admins, 3 normal)
-- Password is 'password' hashed with salt 'salt' (use your backend's hash function for real values)
-- Admins have otp_secret 'LXBSMDTMSP2I5XFXIYRGFVWSFI'
INSERT INTO users (username, name,       hash,                                                             salt,              is_admin, otp_secret) VALUES
  ('alice',      'Alice',    '15d3c4fca80fa608dcedeb65ac10eff78d20c88800d016369a3d2963742ea288', '72e4eeb14def3b21', 0,        NULL),
  ('bob',        'Bob',      '15d3c4fca80fa608dcedeb65ac10eff78d20c88800d016369a3d2963742ea288', '72e4eeb14def3b21', 0,        NULL),
  ('carol',      'Carol',    '15d3c4fca80fa608dcedeb65ac10eff78d20c88800d016369a3d2963742ea288', '72e4eeb14def3b21', 0,        NULL),
  ('admin1',     'Admin One','15d3c4fca80fa608dcedeb65ac10eff78d20c88800d016369a3d2963742ea288', '72e4eeb14def3b21', 1, 'LXBSMDTMSP2I5XFXIYRGFVWSFI'),
  ('admin2',     'Admin Two','15d3c4fca80fa608dcedeb65ac10eff78d20c88800d016369a3d2963742ea288', '72e4eeb14def3b21', 1, 'LXBSMDTMSP2I5XFXIYRGFVWSFI');

-- Each user (including admins) publishes 2 posts
INSERT INTO posts (title,           author_id, text,                                      max_comments, timestamp) VALUES
  ('Cybersecurity Basics',         1, 'Exploring the basics of cybersecurity.',                   3, '2024-06-01 10:00:00'),
  ('SQL Injection Explained',      1, 'Understanding SQL injection attacks.',                     2, '2024-06-02 11:00:00'),
  ('Web App Security Tips',        2, 'How to secure your web applications.',                     2, '2024-06-01 12:00:00'),
  ('Password Management Guide',    2, 'Best practices for password management.',                  3, '2024-06-03 09:00:00'),
  ('Encryption Essentials',        3, 'The importance of encryption in data security.',           2, '2024-06-01 13:00:00'),
  ('Web App Vulnerabilities',      3, 'Common vulnerabilities in web apps.',                      2, '2024-06-04 08:00:00'),
  ('Network Security Insights',    4, 'Admin1 shares insights on network security.',              2, '2024-06-01 14:00:00'),
  ('Two-Factor Authentication',    4, 'How to implement two-factor authentication.',              2, '2024-06-05 07:00:00'),
  ('Future of Cybersecurity',      5, 'Admin2 discusses the future of cybersecurity.',            2, '2024-06-01 15:00:00'),
  ('AI in Cybersecurity',          5, 'The role of AI in cybersecurity.',                         2, '2024-06-06 06:00:00'),
  ('Device Security Tips',         1, 'Tips for securing your personal devices.',                 3, '2024-06-07 10:00:00'),
  ('Phishing Awareness',           2, 'Understanding phishing attacks.',                          2, '2024-06-08 11:00:00');

-- Add comments (some anonymous, some by users)
-- At least one post for a user and one for an admin should have 1 less comment than max
INSERT INTO comments (post_id, author_id, text,                                      timestamp) VALUES
  (1, 2, 'Great introduction to cybersecurity, Alice!',                              '2024-06-01 10:30:00'),
  (1, NULL, 'This is very helpful for beginners.',                                   '2024-06-01 10:40:00'),
  (2, 3, 'SQL injection is a critical topic. Thanks for sharing!',                   '2024-06-02 11:30:00'),
  (3, 1, 'Thanks for the tips, Bob. Very useful!',                                   '2024-06-01 12:30:00'),
  (3, NULL, 'I learned a lot from this post.',                                       '2024-06-01 12:40:00'),
  (4, 3, 'Password management is so important. Great post!',                         '2024-06-03 09:30:00'),
  (5, 1, 'Encryption is the backbone of data security.',                             '2024-06-01 13:30:00'),
  (6, NULL, 'This post highlights some key vulnerabilities.',                        '2024-06-04 08:30:00'),
  (7, 5, 'Network security is a vast and critical field.',                           '2024-06-01 14:30:00'),
  (8, NULL, 'Two-factor authentication is a must-have.',                             '2024-06-05 07:30:00'),
  (9, 4, 'AI will definitely shape the future of cybersecurity.',                    '2024-06-01 15:30:00'),
  (11, 3, 'Securing personal devices is often overlooked.',                          '2024-06-07 10:30:00'),
  (12, 1, 'Phishing attacks are becoming more sophisticated.',                       '2024-06-08 11:30:00');

-- Add some interesting flags
INSERT INTO comment_interesting_flags (user_id, comment_id) VALUES
  (1, 1), -- Alice finds Bob's comment interesting
  (2, 3), -- Bob finds Carol's comment interesting
  (3, 4), -- Carol finds Alice's comment interesting
  (4, 5), -- Admin1 finds anonymous comment interesting
  (5, 7), -- Admin2 finds Alice's comment interesting
  (2, 8), -- Bob finds anonymous comment interesting
  (3, 9), -- Carol finds Admin1's comment interesting
  (1, 11),-- Alice finds Carol's comment interesting
  (5, 12);-- Admin2 finds Alice's comment interesting
