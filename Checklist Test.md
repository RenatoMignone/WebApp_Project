# ✅ Web Application Testing Checklist

## 🔐 Authentication & Authorization
 
- [ x ] Unauthenticated users can log in using correct credentials.   
- [ x ] Login with wrong credentials shows a proper error.  
- [ x ] Logged-in users stay logged in across routes.
- [ x ] Admins can log in with/without 2FA.
- [ x ] Users and admins can log out successfully.
- [ x ] After logout, protected features are inaccessible.
- [ x ] Session is invalidated after logout (`/api/sessions/current` returns 401).

## 🧑‍💻 User Roles

- [ x ] Normal users cannot access admin-only features.
- [ x ] Admins can edit/delete any comment or post.
- [ x ] Admins need TOTP to access admin features.

## 📝 Posts

- [ ] Authenticated users can create posts with required fields.
- [ ] Posts enforce unique titles.
- [ ] Posts respect max comment limit.
- [ ] Posts display in reverse chronological order.
- [ ] Deleting a post deletes its comments.

## 💬 Comments

- [ ] Anyone (authenticated or not) can add comments.
- [ ] Anonymous comments appear correctly.
- [ ] Users can edit/delete their own comments.
- [ ] Editing a comment keeps the original timestamp.
- [ ] Interesting flags are private to the user.
- [ ] Max number of comments is respected.

## 🌐 UI/UX

- [ ] Header changes based on login state.
- [ ] Unauthenticated users see login button.
- [ ] Authenticated users see username and logout.
- [ ] Timestamps display as `YYYY-MM-DD HH:mm:ss`.
- [ ] SPA navigation works without full reload.
- [ ] Unknown routes show the 404 page.
- [ ] Layout works on all screen sizes.

## 🛡️ Security

### Login & Session

- [ ] Passwords stored hashed and salted in DB.
- [ ] Session uses server-side cookies, not localStorage.
- [ ] Admins use correct TOTP secret.
- [ ] Session cookies are HttpOnly and Secure (in production).
- [ ] 2FA is only required for admins.

### Access Control

- [ ] Normal users can't edit/delete others' posts/comments.
- [ ] Anonymous users can't post (only comment).
- [ ] Admin-only features are hidden from unauthorized users.
- [ ] API access is protected even if UI is bypassed.

## 🔁 API & Database

- [ ] `/api/posts` returns correct post data.
- [ ] Deleting post cascades delete its comments.
- [ ] Edited comments update only the content.
- [ ] Post with same title is rejected.
- [ ] Comment limit on post is enforced.
- [ ] Admins can override post/comment limits if applicable.

## 🧪 Edge Cases

- [ ] Empty titles/comments are rejected.
- [ ] Multiline content renders correctly.
- [ ] One-comment-over-limit is rejected.
- [ ] Post with `max_comments = 0` allows no comments.
- [ ] Large text input handled without crash.
- [ ] SQL injection attempts are ineffective.

## 🐞 Error Handling

- [ ] API errors return JSON with messages.
- [ ] Fetch failures handled gracefully in frontend.
- [ ] Invalid routes trigger 404.
- [ ] Unauthorized access returns 401/403.
- [ ] Unexpected errors logged but UI survives.

## 📱 Accessibility & Performance (Optional)

- [ ] All features work with keyboard only.
- [ ] Buttons and links are properly labeled.
- [ ] Icons/images have alt or ARIA labels.
- [ ] Lighthouse performance score is acceptable.

## 🔢 Manual 2FA Test (TOTP)

- [ ] Admin logs in, prompted for TOTP.
- [ ] Invalid TOTP code is rejected.
- [ ] TOTP works with secret `LXBSMDTMSP2I5XFXIYRGFVWSFI`.

