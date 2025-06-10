# Cybersecurity Forum - Web Application Project

A modern forum application built with React and Express.js, featuring user authentication, 2FA for administrators, and anonymous posting capabilities.

## 1. Server-side

### HTTP APIs

#### Authentication APIs
- `POST /api/sessions` - User login with username and password. Returns user info and canDoTotp flag for admins.
- `POST /api/login-totp` - TOTP verification for admin users. Requires 6-digit TOTP code.
- `DELETE /api/sessions/current` - User logout. Destroys the current session.
- `GET /api/sessions/current` - Get current user information. Returns user details if authenticated.

#### Posts APIs
- `GET /api/posts` - Retrieve all posts with author, timestamp, and comment count.
- `GET /api/posts/:id` - Get a specific post by ID with full details.
- `POST /api/posts` - Create a new post. Requires authentication. Body: {title, text, max_comments?}
- `DELETE /api/posts/:id` - Delete a post. Only author or admin with 2FA can delete.

#### Comments APIs
- `GET /api/posts/:postId/comments` - Get all comments for a post. Anonymous users see only anonymous comments.
- `POST /api/posts/:postId/comments` - Add comment to a post. Body: {text}. Can be anonymous.
- `PUT /api/comments/:id` - Edit a comment. Only author or admin with 2FA can edit. Body: {text}
- `DELETE /api/comments/:id` - Delete a comment. Only author or admin with 2FA can delete.

#### Interesting Comments APIs
- `POST /api/comments/:id/interesting` - Mark a comment as interesting. Requires authentication.
- `DELETE /api/comments/:id/interesting` - Remove interesting mark from a comment. Requires authentication.

### Database Tables

#### users
Purpose: Store user account information and authentication details
Columns: id, username, password (hashed), name, is_admin, totp_secret

#### posts
Purpose: Store forum posts with metadata
Columns: id, title, text, author_id, timestamp, max_comments

#### comments
Purpose: Store comments associated with posts
Columns: id, text, author_id, post_id, timestamp

#### flags
Purpose: Track which comments users have marked as interesting
Columns: user_id, comment_id (composite primary key)

## 2. Client-side

### Routes

- `/` - Main forum view displaying post list and selected post details with comments
- `/login` - Authentication page with username/password login and TOTP verification for admins
- `/post/:postId` - Individual post view (nested route, displays in main layout)
- `*` - 404 Not Found page for invalid routes

### Main React Components

#### Layout Components
- `ForumLayout` - Main application layout with navigation, sidebar, and content area
- `LoginLayout` - Authentication page layout with login form container
- `NotFoundLayout` - 404 error page with navigation back to forum

#### Core Components
- `App` - Root component managing global state, authentication, and routing
- `NavigationBar` - Fixed top navigation with user info and login/logout functionality
- `PostList` - Sidebar component displaying all forum posts with selection functionality
- `PostDetails` - Main content area showing selected post with delete functionality
- `CommentList` - Display comments with edit, delete, and interesting mark features
- `AddPostForm` - Form for creating new posts with title, content, and comment limits
- `AddCommentForm` - Form for adding comments (authenticated or anonymous)
- `LoginForm` - Authentication form supporting both regular login and TOTP verification

## 3. Overall

### Screenshots

![Post Creation Page](./screenshots/post-creation.png)
*Post creation form showing title, content, and optional comment limit fields*

### User Credentials

#### Regular Users
- **Username**: `user1` | **Password**: `password123` | **Admin**: No
- **Username**: `user2` | **Password**: `password456` | **Admin**: No
- **Username**: `user3` | **Password**: `password789` | **Admin**: No

#### Administrator Users
- **Username**: `admin1` | **Password**: `admin123` | **Admin**: Yes | **2FA**: Required for full privileges
- **Username**: `admin2` | **Password**: `admin456` | **Admin**: Yes | **2FA**: Required for full privileges

**Note**: Admin users can login without 2FA but will have limited access. Full admin privileges (post/comment deletion) require TOTP verification.

## Installation and Setup

1. **Server Setup**:
   ```bash
   cd server
   npm install
   npm start
   ```

2. **Client Setup**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

3. **Database**: SQLite database will be created automatically from the schema in `server/database/forum.sql`

## Features

- **Responsive Design**: Bootstrap-based UI that works on desktop and mobile
- **Anonymous Posting**: Users can post and comment without authentication
- **Two-Factor Authentication**: TOTP-based 2FA for administrator accounts
- **Comment Management**: Mark comments as interesting, edit, and delete functionality
- **Post Moderation**: Authors and admins can delete posts with appropriate permissions
- **Real-time Updates**: Dynamic content updates without page refresh

