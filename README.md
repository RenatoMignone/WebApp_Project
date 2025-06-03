[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/6EO6Vzam)
# Cybersecurity Forum

A full-stack web application for a cybersecurity forum where users can create posts, comment, and interact with the community. Features user authentication, admin privileges, and 2FA support.

## Server-side

### HTTP APIs

#### Authentication
- `POST /api/sessions` - User login (username, password) → Returns user object or 2FA requirement
- `POST /api/login-totp` - TOTP verification (code) → Completes admin authentication
- `DELETE /api/sessions/current` - User logout
- `GET /api/sessions/current` - Get current user info → Returns user object

#### Posts
- `GET /api/posts` - Get all posts → Returns array of post objects with metadata
- `GET /api/posts/:id` - Get single post by ID → Returns post object
- `POST /api/posts` - Create new post (title, text, max_comments) → Creates post (auth required)
- `DELETE /api/posts/:id` - Delete post by ID → Success/error (auth required)

#### Comments
- `GET /api/posts/:postId/comments` - Get comments for post → Returns array of comment objects
- `POST /api/posts/:postId/comments` - Add comment (text) → Creates comment
- `PUT /api/comments/:id` - Edit comment (text) → Updates comment (auth required)
- `DELETE /api/comments/:id` - Delete comment → Success/error (auth required)

#### Interesting Flags
- `POST /api/comments/:id/interesting` - Mark comment as interesting (auth required)
- `DELETE /api/comments/:id/interesting` - Remove interesting flag (auth required)

### Database Tables

#### users
- `id` (INTEGER, PRIMARY KEY) - User unique identifier
- `username` (TEXT, UNIQUE) - User login name
- `name` (TEXT) - Display name
- `hash` (TEXT) - Password hash
- `salt` (TEXT) - Password salt
- `is_admin` (INTEGER) - Admin flag (0/1)
- `totp_secret` (TEXT) - 2FA secret key

#### posts
- `id` (INTEGER, PRIMARY KEY) - Post unique identifier
- `title` (TEXT) - Post title
- `text` (TEXT) - Post content
- `author_id` (INTEGER, FOREIGN KEY) - Reference to users.id
- `timestamp` (TEXT) - Creation timestamp
- `max_comments` (INTEGER) - Maximum allowed comments (NULL = unlimited)

#### comments
- `id` (INTEGER, PRIMARY KEY) - Comment unique identifier
- `text` (TEXT) - Comment content
- `author_id` (INTEGER, FOREIGN KEY) - Reference to users.id (NULL for anonymous)
- `post_id` (INTEGER, FOREIGN KEY) - Reference to posts.id
- `timestamp` (TEXT) - Creation timestamp

#### flags
- `id` (INTEGER, PRIMARY KEY) - Flag unique identifier
- `user_id` (INTEGER, FOREIGN KEY) - Reference to users.id
- `comment_id` (INTEGER, FOREIGN KEY) - Reference to comments.id
- `UNIQUE(user_id, comment_id)` - One flag per user per comment

## Client-side

### Routes

- `/` - Main forum page with post list and details view
- `/login` - User authentication page with 2FA support
- `*` - 404 Not Found page for invalid routes

### Main React Components

#### App.jsx
Main application component managing global state, authentication, and routing logic.

#### Layout.jsx
- `ForumLayout` - Main forum layout with navigation, post list, and detail sections
- `NotFoundLayout` - 404 error page layout

#### Authentication
- `LoginForm` - User login form with username/password and TOTP verification
- `NavigationBar` - Top navigation with user info and logout functionality

#### Posts
- `PostList` - Sidebar list of all forum posts with selection capability
- `PostDetails` - Detailed view of selected post with delete functionality
- `AddPostForm` - Form for creating new posts with title, content, and max comments

#### Comments
- `CommentList` - Display all comments for a post with edit/delete/interesting actions
- `AddCommentForm` - Form for adding comments (authenticated or anonymous)

## Screenshots

![Post Creation Page](./screenshots/post-creation.png)

## Test Users

| Username | Password | Role | 2FA Enabled |
|----------|----------|------|-------------|
| Ren | pwd | Administrator | Yes |
| Elia | pwd | Regular User | No |
| Simone | pwd | Administrator | Yes |
| Andrea | pwd | Regular User | No |
| Alice | pwd | Regular User | No |


### Admin Features
- Admin users must complete 2FA for full privileges
- Can skip 2FA to continue with limited access (regular user permissions)
- Full admin access allows deleting any post/comment

### Anonymous Features
- Can view all posts and comments
- Can add anonymous comments to posts
- Cannot create posts or mark comments as interesting

