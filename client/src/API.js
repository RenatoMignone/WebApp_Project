import dayjs from 'dayjs';

const SERVER_URL = 'http://localhost:3001/api/';

//----------------------------------------------------------------------------
/**
 * Utility function for parsing the HTTP response.
 */
function getJson(httpResponsePromise) {
  // server API always return JSON, in case of error the format is the following { error: <message> } 
  return new Promise((resolve, reject) => {
    httpResponsePromise
      .then((response) => {
        if (response.ok) {
          // Handle 204 No Content (no body to parse)
          if (response.status === 204) {
            resolve({});
          } else {
            response.json()
              .then(json => resolve(json))
              .catch(err => reject({ error: "Cannot parse server response" }))
          }
        } else {
          response.json()
            .then(obj => reject(obj))
            .catch(err => reject({ error: "Cannot parse server response" }))
        }
      })
      .catch(err => reject({ error: "Cannot communicate" }))
  });
}

//############################################################################
// POSTS
//############################################################################

// Fetch all posts from the server
const getPosts = async () => {
  return getJson(
    fetch(SERVER_URL + 'posts', { credentials: 'include' })
  ).then(json => json.map(post => ({
    ...post,
    timestamp: post.timestamp ? dayjs(post.timestamp) : null,
  })));
};

//----------------------------------------------------------------------------
// Fetch a single post by ID
const getPost = async (id) => {
  return getJson(
    fetch(SERVER_URL + `posts/${id}`, { credentials: 'include' })
  ).then(post => ({
    ...post,
    timestamp: post.timestamp ? dayjs(post.timestamp) : null,
  }));
};

//----------------------------------------------------------------------------
// Add a new post to the server
const addPost = async (post) => {
  return getJson(
    fetch(SERVER_URL + 'posts', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post)
    })
  );
};

//----------------------------------------------------------------------------
// Delete a post by ID
const deletePost = async (id) => {
  return getJson(
    fetch(SERVER_URL + `posts/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
  );
};

//############################################################################
// COMMENTS
//############################################################################

// Fetch all comments for a specific post (public endpoint)
const getComments = async (postId) => {
  return getJson(
    fetch(SERVER_URL + `posts/${postId}/comments`, { credentials: 'include' })
  ).then(json => json.map(comment => ({
    ...comment,
    timestamp: comment.timestamp ? dayjs(comment.timestamp) : null,
  })));
};

//----------------------------------------------------------------------------
// Add a new comment to a post
const addComment = async (postId, text) => {
  return getJson(
    fetch(SERVER_URL + `posts/${postId}/comments`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    })
  );
};

//----------------------------------------------------------------------------
// Edit an existing comment by ID
const editComment = async (commentId, text) => {
  return getJson(
    fetch(SERVER_URL + `comments/${commentId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    })
  );
};

//----------------------------------------------------------------------------
// Delete a comment by ID
const deleteComment = async (commentId) => {
  return getJson(
    fetch(SERVER_URL + `comments/${commentId}`, {
      method: 'DELETE',
      credentials: 'include'
    })
  );
};

//############################################################################
// INTERESTING COMMENTS
//############################################################################

// Mark a comment as interesting
const setInteresting = async (commentId) => {
  return getJson(
    fetch(SERVER_URL + `comments/${commentId}/interesting`, {
      method: 'POST',
      credentials: 'include'
    })
  );
};

//----------------------------------------------------------------------------
// Unmark a comment as interesting
const unsetInteresting = async (commentId) => {
  return getJson(
    fetch(SERVER_URL + `comments/${commentId}/interesting`, {
      method: 'DELETE',
      credentials: 'include'
    })
  );
};

//############################################################################
// AUTHENTICATION and 2FAs
//############################################################################

// Log in a user with credentials
const logIn = async (credentials) => {
  return getJson(
    fetch(SERVER_URL + 'sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(credentials)
    })
  );
};

//----------------------------------------------------------------------------
// Verify a TOTP code for 2FA
const logInTotp = async (code) => {
  return getJson(
    fetch(SERVER_URL + 'login-totp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ code })
    })
  );
};

//----------------------------------------------------------------------------
// Log out the current user
const logOut = async () => {
  return getJson(
    fetch(SERVER_URL + 'sessions/current', {
      method: 'DELETE',
      credentials: 'include'
    })
  );
};

//----------------------------------------------------------------------------
// Fetch information about the currently logged-in user
const getUserInfo = async () => {
  return getJson(
    fetch(SERVER_URL + 'sessions/current', {
      credentials: 'include'
    })
  );
};

//----------------------------------------------------------------------------
// Export all API functions
const API = {
  getPosts,
  getPost,
  addPost,
  deletePost,
  getComments,
  addComment,
  editComment,
  deleteComment,
  setInteresting,
  unsetInteresting,
  logIn,
  logInTotp,
  logOut,
  getUserInfo,
};

//----------------------------------------------------------------------------
export default API;
