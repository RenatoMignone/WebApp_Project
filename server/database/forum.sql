-- Enable foreign key constraints to maintain referential integrity
PRAGMA foreign_keys = ON;

-- Users table: stores user account information and authentication data
CREATE TABLE IF NOT EXISTS users (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,  -- Unique user identifier
  username   TEXT    NOT NULL UNIQUE,            -- Unique username for login
  name       TEXT    NOT NULL,                   -- Display name for the user
  hash       TEXT    NOT NULL,                   -- Hashed password for security
  salt       TEXT    NOT NULL,                   -- Salt used for password hashing
  is_admin   INTEGER NOT NULL DEFAULT 0,         -- Admin flag (1 for admin, 0 for regular user)
  otp_secret TEXT                                -- Secret key for two-factor authentication (optional)
);

-- Posts table: stores forum posts/topics created by users
CREATE TABLE IF NOT EXISTS posts (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,          -- Unique post identifier
  title        TEXT    NOT NULL UNIQUE,                    -- Post title (must be unique)
  author_id    INTEGER NOT NULL,                           -- ID of the user who created the post
  text         TEXT    NOT NULL,                           -- Main content/body of the post
  max_comments INTEGER,                                    -- Maximum number of comments allowed on this post
  timestamp    TEXT    NOT NULL DEFAULT (datetime('now')), -- When the post was created
  FOREIGN KEY(author_id) REFERENCES users(id)              -- Links to the user who created the post
);

-- Comments table: stores user comments on posts
CREATE TABLE IF NOT EXISTS comments (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,                   -- Unique comment identifier
  post_id   INTEGER NOT NULL,                                    -- ID of the post this comment belongs to
  author_id INTEGER,                                             -- ID of the user who wrote the comment (NULL for anonymous)
  text      TEXT    NOT NULL,                                    -- Comment content/text
  timestamp TEXT    NOT NULL DEFAULT (datetime('now')),          -- When the comment was posted
  FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE,   -- Links to parent post, deletes comment if post is deleted
  FOREIGN KEY(author_id) REFERENCES users(id)                    -- Links to comment author (optional for anonymous comments)
);

-- Comment flags table: stores which users have flagged comments as "interesting"
CREATE TABLE IF NOT EXISTS comment_interesting_flags (
  user_id    INTEGER NOT NULL,                                        -- ID of the user who flagged the comment
  comment_id INTEGER NOT NULL,                                        -- ID of the comment being flagged
  PRIMARY KEY(user_id, comment_id),                                   -- Composite primary key prevents duplicate flags
  FOREIGN KEY(user_id)    REFERENCES users(id)    ON DELETE CASCADE,  -- Remove flags if user is deleted
  FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE   -- Remove flags if comment is deleted
);

------------------------------------------------------------------------------------------------------------------------------
-- Sample data insertion: Create 5 test users (2 admins, 3 regular users)
-- All users have the same password 'pwdw' hashed with salt for testing purposes
-- Admin users have OTP secrets configured for two-factor authentication
INSERT INTO users (username, name,       hash,                                                             salt,              is_admin, otp_secret) VALUES
  ('Alice',   'Alice',     '15d3c4fca80fa608dcedeb65ac10eff78d20c88800d016369a3d2963742ea288', '72e4eeb14def3b21', 0,        NULL),
  ('Elia',     'Elia', '15d3c4fca80fa608dcedeb65ac10eff78d20c88800d016369a3d2963742ea288', '72e4eeb14def3b21', 0,        NULL),
  ('Andrea',    'Andrea',   '15d3c4fca80fa608dcedeb65ac10eff78d20c88800d016369a3d2963742ea288', '72e4eeb14def3b21', 0,        NULL),
  ('Ren',            'Renato ',  '15d3c4fca80fa608dcedeb65ac10eff78d20c88800d016369a3d2963742ea288', '72e4eeb14def3b21', 1, 'LXBSMDTMSP2I5XFXIYRGFVWSFI'),
  ('Simone',     'Simone','15d3c4fca80fa608dcedeb65ac10eff78d20c88800d016369a3d2963742ea288', '72e4eeb14def3b21', 1, 'LXBSMDTMSP2I5XFXIYRGFVWSFI');

-- Sample posts: Each user creates 2 posts about cybersecurity topics
-- Posts have varying max_comment limits and cover different security domains
INSERT INTO posts (title,           author_id, text,                                      max_comments, timestamp) VALUES
  ('The Dark Arts of Social Engineering', 1, 'Ever wondered how hackers manipulate human psychology? Social engineering attacks exploit our natural trust and curiosity. From pretexting to baiting, these psychological manipulation techniques are often more dangerous than technical exploits. Learn to recognize the red flags: urgent requests, authority impersonation, and emotional manipulation. Remember, the human factor is often the weakest link in any security chain.', 3, '2024-06-01 10:00:00'),
  ('SQL Injection: When Databases Become Weapons', 1, 'SQL injection remains one of the most devastating attack vectors in 2024. Picture this: a single apostrophe in a login field could expose your entire database. Through union-based attacks, blind SQL injection, and time-based techniques, attackers can extract sensitive data, modify records, or even gain administrative access. The scary part? Many developers still write vulnerable code. Always use parameterized queries and input validation!', 2, '2024-06-02 11:00:00'),
  ('Zero-Day Exploits: The Ghost in the Machine', 2, 'Zero-day vulnerabilities are the stuff of nightmares for security professionals. These unknown flaws lurk in software, waiting to be discovered by either white-hat researchers or malicious actors. When exploited, they can bypass all security measures because no patches exist yet. Recent examples include critical RCE vulnerabilities in popular frameworks. The question isn''t if you''ll encounter one, but when.', 2, '2024-06-01 12:00:00'),
  ('Beyond Passwords: The Evolution of Authentication', 2, 'Passwords are dying, and it''s about time! With the rise of passkeys, biometric authentication, and hardware tokens, we''re entering a passwordless future. But this transition brings new challenges: what happens when your fingerprint data is compromised? How do we handle biometric spoofing? Explore the cutting-edge world of WebAuthn, FIDO2, and the security implications of our post-password reality.', 3, '2024-06-03 09:00:00'),
  ('Quantum Cryptography: Preparing for the Apocalypse', 3, 'Quantum computers threaten to break RSA and elliptic curve cryptography as we know it. While practical quantum computers capable of cryptographic attacks are still years away, the time to prepare is NOW. Post-quantum cryptography algorithms like Kyber and Dilithium are our salvation. Organizations must start migrating their cryptographic infrastructure before quantum supremacy becomes reality. The quantum apocalypse is coming!', 2, '2024-06-01 13:00:00'),
  ('API Security: The New Wild West', 3, 'APIs are everywhere, and they''re under constant attack. From broken authentication to excessive data exposure, the OWASP API Security Top 10 reveals a landscape riddled with vulnerabilities. Rate limiting, proper authentication, and input validation are just the beginning. With GraphQL introducing new attack vectors and REST APIs being misconfigured daily, securing your API endpoints has never been more critical.', 2, '2024-06-04 08:00:00'),
  ('Network Segmentation: Building Digital Fortresses', 4, 'In today''s hyper-connected world, network segmentation is your last line of defense against lateral movement attacks. Think of it as building walls within your digital castle. Zero-trust architecture, micro-segmentation, and software-defined perimeters are revolutionizing how we approach network security. Learn why flat networks are security suicide and how proper segmentation can contain even the most sophisticated APTs.', 2, '2024-06-01 14:00:00'),
  ('MFA Bypass Techniques: When Security Theater Fails', 4, 'Multi-factor authentication isn''t bulletproof. SIM swapping, SS7 attacks, and MFA fatigue are turning our "secure" authentication into security theater. Attackers are exploiting push notification approvals, intercepting SMS codes, and even using adversary-in-the-middle attacks against authenticator apps. Discover why your MFA strategy might be giving you false confidence and what truly secure authentication looks like.', 2, '2024-06-05 07:00:00'),
  ('AI vs AI: The Cybersecurity Arms Race', 5, 'Artificial intelligence is transforming cybersecurity into a high-stakes chess match between machines. While AI helps detect anomalies and automate threat response, cybercriminals are weaponizing the same technology. Deepfake social engineering, AI-generated malware, and adversarial machine learning attacks are the new reality. Welcome to the era where your defense AI battles against attack AI in real-time.', 2, '2024-06-01 15:00:00'),
  ('Supply Chain Attacks: The Invisible Threat', 5, 'The SolarWinds hack was just the beginning. Supply chain attacks target the trust relationships between organizations, poisoning software updates and compromising hardware before it reaches your network. From malicious npm packages to compromised firmware, attackers are playing the long game. Every piece of third-party code in your environment is a potential backdoor. Trust no one, verify everything.', 2, '2024-06-06 06:00:00'),
  ('IoT Botnets: When Your Toaster Joins Anonymous', 1, 'Your smart doorbell might be plotting world domination. IoT devices with default credentials and no update mechanisms are being conscripted into massive botnets. Mirai was just the preview - modern IoT botnets are launching DDoS attacks, mining cryptocurrency, and serving as proxies for cybercriminals. With billions of connected devices and abysmal security standards, we''re building the largest botnet in human history.', 3, '2024-06-07 10:00:00'),
  ('Ransomware Evolution: From Nuisance to Nation-State', 2, 'Ransomware has evolved from simple file encryption to sophisticated double-extortion schemes. Modern ransomware groups operate like legitimate businesses with customer support, affiliate programs, and SLA guarantees. They''re targeting critical infrastructure, stealing data before encryption, and even offering "penetration testing" services. The line between cybercriminals and nation-state actors is blurring as ransomware becomes a tool of geopolitical warfare.', 2, '2024-06-08 11:00:00');

-- Sample comments: Add realistic comments from users and anonymous contributors
-- Some posts are left with fewer comments than their maximum to demonstrate the limit system
INSERT INTO comments (post_id, author_id, text,                                      timestamp) VALUES
  (1, 2, 'Absolutely terrifying how effective social engineering can be. I once saw someone get pwned by a fake IT support call asking for their "temporary password verification." The psychological manipulation is real!',                              '2024-06-01 10:30:00'),
  (1, NULL, 'This hits close to home. My company fell victim to a pretexting attack last year. The attacker impersonated our CEO and convinced accounting to wire $50k. Human psychology is definitely the weakest link.',                                   '2024-06-01 10:40:00'),
  (2, 3, 'SQL injection in 2024 still blows my mind. I do penetration testing for a living and STILL find SQLi vulnerabilities in "secure" applications. It''s like developers never learned from Bobby Tables!',                   '2024-06-02 11:30:00'),
  (3, 1, 'Zero-days keep me up at night. The thought that there could be critical vulnerabilities in our infrastructure that we don''t even know about is genuinely scary. Time to implement more defense in depth!',                                   '2024-06-01 12:30:00'),
  (3, NULL, 'Working in threat intel, I can confirm zero-days are traded like commodities on dark markets. The sophistication level is insane - some exploits come with full documentation and customer support.',                                       '2024-06-01 12:40:00'),
  (4, 3, 'Finally, someone who gets it! Passwords are archaeological artifacts that need to die. I''ve been implementing WebAuthn in our apps and the user experience is incredible. No more password123! schemes.',                         '2024-06-03 09:30:00'),
  (5, 1, 'The quantum threat is real but overhyped in the near term. We have time to migrate to post-quantum crypto, but organizations need to start planning NOW. The migration will be painful and expensive.',                             '2024-06-01 13:30:00'),
  (6, NULL, 'API security is a nightmare. I audit APIs daily and find the most ridiculous vulnerabilities - APIs returning entire user databases, no rate limiting, JWT tokens with "none" algorithm. It''s the wild west out there.',                        '2024-06-04 08:30:00'),
  (7, 5, 'Network segmentation saved our bacon during a recent breach. The attackers got initial access but couldn''t move laterally due to our micro-segmentation strategy. Invest in proper network architecture, people!',                           '2024-06-01 14:30:00'),
  (8, NULL, 'MFA fatigue attacks are brilliant and terrifying. Bombard users with push notifications until they approve one just to make it stop. We need better UX in security tools to prevent this.',                             '2024-06-05 07:30:00'),
  (9, 4, 'The AI arms race is fascinating and scary. I''ve seen AI-generated phishing emails that are indistinguishable from legitimate communications. When deepfakes become mainstream, how do we trust anything?',                    '2024-06-01 15:30:00'),
  (11, 3, 'IoT security is a joke. I have a "smart" light bulb that broadcasts its WiFi password in plaintext. We''re literally building the infrastructure for our own digital enslavement.',                          '2024-06-07 10:30:00'),
  (12, 1, 'Ransomware-as-a-Service is genuinely changing the threat landscape. Script kiddies can now deploy enterprise-grade ransomware with affiliate support. The democratization of cybercrime is terrifying.',                       '2024-06-08 11:30:00');
