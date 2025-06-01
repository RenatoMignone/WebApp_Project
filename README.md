[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/6EO6Vzam)
# Exam #1234: "Forum Web Application"
## Student: s123456 LASTNAME FIRSTNAME 

## React Client Application Routes

- Route `/`: List of all posts (title, author, comments count/max)
- Route `/posts/:id`: Post details and comments (chronological order)
- Route `/login`: Login page (with 2FA for admins)
- Route `/add-post`: Add new post (authenticated users)
- Route `/edit-comment/:id`: Edit comment (author/admin only)
- ...

## API Server

- POST `/api/login`
  - { username, password, [otp] }
  - { user info }
- GET `/api/posts`
  - none
  - [{ post info }]
- GET `/api/posts/:id/comments`
  - none
  - [{ comment info }]
- POST `/api/posts`
  - { title, text, max_comments }
  - { post info }
- POST `/api/comments`
  - { post_id, text }
  - { comment info }
- PUT `/api/comments/:id`
  - { text }
  - { comment info }
- DELETE `/api/posts/:id`
  - none
  - { result }
- DELETE `/api/comments/:id`
  - none
  - { result }
- POST `/api/comments/:id/interesting`
  - none
  - { result }
- DELETE `/api/comments/:id/interesting`
  - none
  - { result }
- ...

## Database Tables

- Table `users` - id, username, name, hash, salt, is_admin
- Table `posts` - id, title, author_id, text, max_comments, timestamp
- Table `comments` - id, post_id, author_id, text, timestamp
- Table `comment_interesting_flags` - user_id, comment_id

## Main React Components

- `PostList` (in `PostList.jsx`): shows all posts
- `PostDetails` (in `PostDetails.jsx`): shows post and comments
- `LoginForm` (in `LoginForm.jsx`): login and 2FA
- `AddPostForm` (in `AddPostForm.jsx`): add post
- `CommentForm` (in `CommentForm.jsx`): add/edit comment
- ...

## Screenshot

![Screenshot](./img/screenshot.png)

## Users Credentials

- user1, pwd1 (user)
- user2, pwd2 (user)
- admin1, pwdadmin1 (admin, 2FA: LXBSMDTMSP2I5XFXIYRGFVWSFI)
- admin2, pwdadmin2 (admin, 2FA: LXBSMDTMSP2I5XFXIYRGFVWSFI)
- ...

