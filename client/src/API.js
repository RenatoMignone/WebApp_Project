import dayjs from 'dayjs';

const SERVER_URL = 'http://localhost:3001/api/';

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

// --- POSTS ---

const getPosts = async () => {
  return getJson(
    fetch(SERVER_URL + 'posts', { credentials: 'include' })
  ).then(json => json.map(post => ({
    ...post,
    timestamp: post.timestamp ? dayjs(post.timestamp) : null,
  })));
};

const getPost = async (id) => {
  return getJson(
    fetch(SERVER_URL + `posts/${id}`, { credentials: 'include' })
  ).then(post => ({
    ...post,
    timestamp: post.timestamp ? dayjs(post.timestamp) : null,
  }));
};

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

const deletePost = async (id) => {
  return getJson(
    fetch(SERVER_URL + `posts/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
  );
};

// --- COMMENTS ---

const getComments = async (postId) => {
  return getJson(
    fetch(SERVER_URL + `posts/${postId}/comments`, { credentials: 'include' })
  ).then(json => json.map(comment => ({
    ...comment,
    timestamp: comment.timestamp ? dayjs(comment.timestamp) : null,
  })));
};

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

const deleteComment = async (commentId) => {
  return getJson(
    fetch(SERVER_URL + `comments/${commentId}`, {
      method: 'DELETE',
      credentials: 'include'
    })
  );
};

// --- INTERESTING FLAGS ---

const setInteresting = async (commentId) => {
  return getJson(
    fetch(SERVER_URL + `comments/${commentId}/interesting`, {
      method: 'POST',
      credentials: 'include'
    })
  );
};

const unsetInteresting = async (commentId) => {
  return getJson(
    fetch(SERVER_URL + `comments/${commentId}/interesting`, {
      method: 'DELETE',
      credentials: 'include'
    })
  );
};

// --- AUTHENTICATION & 2FA ---

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

const logOut = async () => {
  return getJson(
    fetch(SERVER_URL + 'sessions/current', {
      method: 'DELETE',
      credentials: 'include'
    })
  );
};

const getUserInfo = async () => {
  return getJson(
    fetch(SERVER_URL + 'sessions/current', {
      credentials: 'include'
    })
  );
};

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

export default API;
