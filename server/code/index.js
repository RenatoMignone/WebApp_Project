'use strict';

// This file sets up an Express server with Passport.js for authentication,
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');

const passport = require('passport');
const base32 = require('thirty-two');
const LocalStrategy = require('passport-local');
const TotpStrategy = require('passport-totp').Strategy;

const daoUsers = require('./dao-users');
const daoPosts = require('./dao-posts');
const daoComments = require('./dao-comments');
const daoFlags = require('./dao-flags');

const { validationResult, body } = require('express-validator');

//----------------------------------------------------------------------------
// Create the Express app and configure middleware
const app = express();
const port = 3001;

//----------------------------------------------------------------------------
// Middleware setup
app.use(morgan('dev'));
app.use(express.json());

// Enable CORS for the frontend communication
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));

///----------------------------------------------------------------------------
// Session management with SQLite store
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

//----------------------------------------------------------------------------
// Initialize Passport.js for authentication
// The local strategy is used for username/password authentication
passport.use(new LocalStrategy(
  function(username, password, done) {
    daoUsers.getUser(username, password)
      .then(user => {
        if (!user) return done(null, false, { message: 'Incorrect username or password.' });
        return done(null, user);
      })
      .catch(err => done(err));
  }
));

//----------------------------------------------------------------------------
// The TOTP strategy is used for two-factor authentication (2FA)
passport.use(new TotpStrategy(
  function(user, done) {
    // Only enable TOTP if user has otp_secret (admin users)
    if (!user.otp_secret) return done(null, null);
    return done(null, base32.decode(user.otp_secret), 30);
  }
));

//----------------------------------------------------------------------------
// Serialize and deserialize user instances to support sessions
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  daoUsers.getUserById(id)
    .then(user => done(null, user))
    .catch(err => done(err, null));
});

//----------------------------------------------------------------------------
// middleware to check if user is authenticated
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ error: 'Not authenticated' });
}

//----------------------------------------------------------------------------
// Helper to send user info to client, including isTotp
function clientUserInfo(req) {
  const user = req.user;
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    is_admin: user.is_admin,
    canDoTotp: !!user.otp_secret,
    isTotp: req.session.secondFactor === 'totp'
  };
}


//#############################################################################
// Authentication APIs

// Login (username/password)
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) return next(err);
    if (!user) return res.status(401).json(info);

    req.login(user, function(err) {
      if (err) return next(err);

      // If admin and has otp_secret, require TOTP
      if (user.is_admin && user.otp_secret) {
        req.session.secondFactor = 'pending';
        return res.json({
          ...clientUserInfo(req),
          canDoTotp: true,
          isTotp: false
        });
      } else {
        req.session.secondFactor = 'totp';
        return res.json({
          ...clientUserInfo(req),
          canDoTotp: false,
          isTotp: true
        });
      }
    });
  })(req, res, next);
});

//----------------------------------------------------------------------------
// TOTP verification (2FA)
app.post('/api/login-totp', isLoggedIn, function(req, res, next) {
  
  if (!req.user.otp_secret) {
    return res.status(400).json({ error: 'TOTP not enabled for this user' });
  }

  passport.authenticate('totp', function(err, user, info) {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: 'Invalid TOTP code' });

    req.session.secondFactor = 'totp';
    return res.json({ success: true });
  })(req, res, next);

});

//----------------------------------------------------------------------------
// Get current session info
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(clientUserInfo(req));
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

//----------------------------------------------------------------------------
// Logout, the user is logged out and the session is destroyed
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    req.session.destroy(() => res.status(204).end());
  });
});


//#############################################################################
// Forum APIs

// List all posts (public)
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await daoPosts.listPosts();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

//----------------------------------------------------------------------------
// Get post by id (public)
app.get('/api/posts/:id', async (req, res) => {
  try {
    const post = await daoPosts.getPostById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

//----------------------------------------------------------------------------
// GET /api/posts/:id/comments - Get comments for a specific post (no authentication required)
app.get('/api/posts/:id/comments', async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const userId = req.user?.id || null; // Get user ID if authenticated, null otherwise
    const comments = await daoComments.getCommentsByPost(postId, userId);
    
    // If user is not authenticated, filter to show only anonymous comments (author_id is null)
    const filteredComments = !req.user 
      ? comments.filter(comment => comment.author_id === null || comment.author_id === undefined)
      : comments;
    
    res.json(filteredComments);
  } catch (err) {
    console.error('Error getting comments:', err);
    res.status(500).json({ error: 'Failed to get comments' });
  }
});

//----------------------------------------------------------------------------
// POST /api/posts - Add a new post
app.post('/api/posts', isLoggedIn, [
  body('title').isLength({min: 1}).withMessage('Title is required'),
  body('text').isLength({min: 1}).withMessage('Text is required'),
  // Fix: Allow max_comments to be 0
  body('max_comments').optional().isInt({min: 0}).withMessage('Max comments must be a non-negative integer')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({error: errors.array()});
  }

  try {
    const post = {
      title: req.body.title,
      text: req.body.text,
      author_id: req.user.id,
      // Fix: Explicitly handle 0 value
      max_comments: req.body.max_comments === 0 ? 0 : (req.body.max_comments || null)
    };
    
    const postId = await daoPosts.addPost(post);
    res.status(201).json({id: postId});
  } catch (err) {
    console.error('Error adding post:', err);
    res.status(500).json({error: 'Database error'});
  }
});

//----------------------------------------------------------------------------
// DELETE /api/posts/:id - Delete a post (admin with 2FA only)
app.delete('/api/posts/:id', isLoggedIn, async (req, res) => {
  try {
    const post = await daoPosts.getPostById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    // Only author or admin with TOTP can delete
    if (String(post.author_id) !== String(req.user.id) && !(req.user.is_admin && req.session.secondFactor === 'totp'))
      return res.status(403).json({ error: 'Forbidden' });
    await daoPosts.deletePost(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

//----------------------------------------------------------------------------
// Add a comment (anyone, anonymous if not logged in)
app.post('/api/posts/:id/comments', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Missing text' });
    const post = await daoPosts.getPostById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    // Check max comments
    if (post.max_comments && post.comments_count >= post.max_comments)
      return res.status(400).json({ error: 'Max comments reached' });
    const comment = {
      post_id: req.params.id,
      author_id: req.isAuthenticated() ? req.user.id : null,
      text
    };
    const id = await daoComments.addComment(comment);
    res.status(201).json({ id });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

//----------------------------------------------------------------------------
// Edit a comment (author or admin with 2FA)
app.put('/api/comments/:id', isLoggedIn, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Missing text' });
    const is_admin = req.user.is_admin && req.session.secondFactor === 'totp';
    const changes = await daoComments.editComment(req.params.id, text, req.user.id, is_admin);
    if (changes === 0) return res.status(403).json({ error: 'Forbidden' });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

//----------------------------------------------------------------------------
// DELETE /api/comments/:id - Delete a comment (admin with 2FA only)
app.delete('/api/comments/:id', isLoggedIn, async (req, res) => {
  try {
    const is_admin = req.user.is_admin && req.session.secondFactor === 'totp';
    const changes = await daoComments.deleteComment(req.params.id, req.user.id, is_admin);
    if (changes === 0) return res.status(403).json({ error: 'Forbidden' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

//----------------------------------------------------------------------------
// POST /api/comments/:id/interesting - Mark a comment as interesting (authentication required)
app.post('/api/comments/:id/interesting', isLoggedIn, async (req, res) => {
  try {
    const commentId = parseInt(req.params.id);
    const userId = req.user.id;
    await daoComments.setInteresting(commentId, userId);
    res.status(204).end();
  } catch (err) {
    console.error('Error setting interesting:', err);
    res.status(500).json({ error: 'Failed to mark comment as interesting' });
  }
});

// DELETE /api/comments/:id/interesting - Remove interesting mark from comment (authentication required)
app.delete('/api/comments/:id/interesting', isLoggedIn, async (req, res) => {
  try {
    const commentId = parseInt(req.params.id);
    const userId = req.user.id;
    await daoComments.unsetInteresting(commentId, userId);
    res.status(204).end();
  } catch (err) {
    console.error('Error unsetting interesting:', err);
    res.status(500).json({ error: 'Failed to remove interesting mark' });
  }
});

//----------------------------------------------------------------------------
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
//----------------------------------------------------------------------------
