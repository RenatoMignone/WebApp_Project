# Cybersecurity Forum - Web Application Project

Student: s336973 MIGNONE RENATO

## 1. Server-side

### API Server

#### Authentication APIs
- `POST /api/sessions` - User login. Body: `{username, password}`. Returns user info with canDoTotp flag.
- `POST /api/login-totp` - TOTP verification for admin users. Body: `{code}`. Returns success confirmation.
- `DELETE /api/sessions/current` - User logout. Returns 204.
- `GET /api/sessions/current` - Get current user information.

#### Posts APIs
- `GET /api/posts` - Retrieve all posts with author and comment count.
- `GET /api/posts/:id` - Get specific post by ID.
- `POST /api/posts` - Create new post (auth required). Body: `{title, text, max_comments?}`.
- `DELETE /api/posts/:id` - Delete post (author or admin with 2FA).

#### Comments APIs
- `GET /api/posts/:postId/comments` - Get comments for a post (filtered for anonymous users).
- `POST /api/posts/:postId/comments` - Add comment. Body: `{text}`. Anonymous or authenticated.
- `PUT /api/comments/:id` - Edit comment (author or admin with 2FA). Body: `{text}`.
- `DELETE /api/comments/:id` - Delete comment (author or admin with 2FA).

#### Interesting Comments APIs
- `POST /api/comments/:id/interesting` - Mark comment as interesting (auth required).
- `DELETE /api/comments/:id/interesting` - Remove interesting mark (auth required).

### Database Tables

- **users**: id (PK), username (unique), name, hash, salt, is_admin, otp_secret
- **posts**: id (PK), title (unique), text, author_id (FK), timestamp, max_comments  
- **comments**: id (PK), post_id (FK), author_id (FK, nullable), text, timestamp
- **comment_interesting_flags**: user_id (FK), comment_id (FK) [composite PK]

## 2. Client-side

### Application Routes

- `/` - Main forum view with post list sidebar and selected post details.
- `/login` - Authentication page with username/password and optional TOTP.
- `*` - 404 Not Found page for invalid routes.

### Main React Components

- `App` - Root component managing authentication and routing.
- `ForumLayout` - Main layout with navigation, sidebar, and content area.
- `LoginLayout` - Authentication page with conditional TOTP verification.
- `NavigationBar` - Fixed navigation with user info and login/logout.
- `PostList` - Sidebar displaying all posts with selection and counts.
- `PostDetails` - Main content showing selected post with delete option.
- `CommentList` - Comments display with edit/delete/interesting features.
- `AddPostForm` - Post creation form (authenticated users only).
- `AddCommentForm` - Comment form supporting anonymous and authenticated users.
- `LoginForm` - Authentication form with regular login and TOTP support.


## 3. Overall

### Screenshots

#### Login Page
![Login Page](./img/login_page.png)

#### Page Not Found
![Not Found Page](./img/not_found_page.png)

#### Main Page (Unauthenticated User)
![Unauthenticated User Main Page](./img/unauthenticated_user_page.png)

#### Main Page (Authenticated User)
![Authenticated User Main Page](./img/Post_Creation_Page.png)

#### Main Page (Admin User)
![Admin Main Page](./img/Post_Creation_Page.png)


### User Credentials

#### Regular Users
- **Username**: `Alice` | **Password**: `pwd` | **Role**: User
- **Username**: `Elia` | **Password**: `pwd` | **Role**: User
- **Username**: `Andrea` | **Password**: `pwd` | **Role**: User

#### Administrator Users
- **Username**: `Ren` | **Password**: `pwd` | **Role**: Admin | **2FA**: Required for full privileges
- **Username**: `Simone` | **Password**: `pwd` | **Role**: Admin | **2FA**: Required for full privileges

**Note**: Admin users can login without 2FA but will have limited access. Full admin privileges (post/comment deletion) require TOTP verification.
