// -----------------------------------------------------------------------------
// App Component
// -----------------------------------------------------------------------------
// This file defines the main App component, which serves as the root of the
// application. It manages the state of the application, handles authentication,
// and defines routes for navigation.
// -----------------------------------------------------------------------------

import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import API from './API';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { ForumLayout as Layout } from './components/Layout'; // Use named import
import LoginForm from './components/LoginForm';
import { Row, Col } from 'react-bootstrap';

// --- Main App ---
function App() {
  const [user, setUser] = useState(null);
  const [totpRequired, setTotpRequired] = useState(false);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Load posts on mount and whenever a post is added, deleted, or edited
  async function refreshPosts() {
    // Fetch posts from the API and update the state
    try {
      const posts = await API.getPosts();
      setPosts(posts);
    } catch {
      setMessage('Error loading posts');
    }
  }

  useEffect(() => {
    refreshPosts();
    // eslint-disable-next-line
  }, []);

  // Load comments when a post is selected and user is authenticated
  useEffect(() => {
    if (selectedPost && user) {
      API.getComments(selectedPost.id)
        .then(setComments)
        .catch(() => setMessage('Error loading comments'));
    } else {
      setComments([]);
    }
  }, [selectedPost, user]);

  // Check session on mount
  useEffect(() => {
    API.getUserInfo()
      .then(u => setUser(u))
      .catch(() => setUser(null));
  }, []);

  // --- Authentication handlers ---
  async function handleLogin(credentials) {
    try {
      const res = await API.logIn(credentials);
      // Fix: Only set user if TOTP is not required, otherwise only set totpRequired
      if (res.canDoTotp) {
        setTotpRequired(true);
        setUser(null); // Do not set user yet, wait for TOTP verification
      } else {
        setUser({ ...res, isTotp: true });
        setTotpRequired(false);
        navigate('/');
      }
      setMessage('');
    } catch (err) {
      setMessage('Login failed');
    }
  }

  async function handleTotp(code) {
    try {
      await API.logInTotp(code);
      const u = await API.getUserInfo();
      setUser(u);
      setTotpRequired(false);
      setMessage('');
      navigate('/');
    } catch (err) {
      setMessage('Invalid TOTP code');
    }
  }

  async function handleLogout() {
    await API.logOut();
    setUser(null);
    setTotpRequired(false);
    setSelectedPost(null);
    setComments([]);
    setMessage('');
    navigate('/login'); // This ensures redirect to login after logout
  }

  // --- Post handlers ---
  async function handleSelectPost(post) {
    setSelectedPost(post);
    setComments([]);
    if (user) {
      try {
        const comms = await API.getComments(post.id);
        setComments(comms);
      } catch {
        setMessage('Error loading comments');
      }
    }

  }

  async function handleAddPost(post) {
    if (!post.title.trim() || !post.text.trim()) {
      setMessage('Title and text are required');
      return;
    }
    try {
      await API.addPost(post);
      await refreshPosts();
      setMessage('Post added');
      setTimeout(() => setMessage(''), 2000); // Clear message after 2 seconds
    } catch (e) {
      setMessage(e?.response?.data?.error || 'Error adding post');
    }
  }

  async function handleDeletePost(postId) {
    try {
      await API.deletePost(postId);
      await refreshPosts();
      setSelectedPost(null);
      setComments([]);
      setMessage('Post deleted');
      setTimeout(() => setMessage(''), 2000); // Clear message after 2 seconds
    } catch (e) {
      setMessage(e?.error || 'Error deleting post');
    }
  }

  // If you have post editing, also call await refreshPosts() after editing.

  // --- Comment handlers ---
  async function handleAddComment(postId, text) {
    if (!text.trim()) {
      setMessage('Comment text is required');
      return;
    }
    try {
      await API.addComment(postId, text);
      if (user) {
        const comms = await API.getComments(postId);
        setComments(comms);
      }
      setMessage('Comment added');
      // Dynamically update the comment count for the post in the posts array
      setPosts(posts =>
        posts.map(p =>
          p.id === postId
            ? { ...p, comments_count: (p.comments_count || 0) + 1 }
            : p
        )
      );
    } catch (e) {
      setMessage(e?.response?.data?.error || 'Error adding comment');
    }
  }

  async function handleEditComment(commentId, text) {
    if (!text.trim()) {
      setMessage('Comment text is required');
      return;
    }
    try {
      await API.editComment(commentId, text);
      if (user && selectedPost) {
        const comms = await API.getComments(selectedPost.id);
        setComments(comms);
      }
      setMessage('Comment edited');
    } catch (e) {
      setMessage(e?.response?.data?.error || 'Error editing comment');
    }
  }

  async function handleDeleteComment(commentId) {
    try {
      await API.deleteComment(commentId);
      if (user && selectedPost) {
        const comms = await API.getComments(selectedPost.id);
        setComments(comms);
        setPosts(posts =>
          posts.map(p =>
            p.id === selectedPost.id
              ? { ...p, comments_count: Math.max((p.comments_count || 1) - 1, 0) }
              : p
          )
        );
      }
      setMessage('Comment deleted');
      setTimeout(() => setMessage(''), 2000); // Clear message after 2 seconds
    } catch (e) {
      setMessage(e?.response?.data?.error || 'Error deleting comment');
    }
  }

  async function handleSetInteresting(commentId) {
    try {
      await API.setInteresting(commentId);
      if (user && selectedPost) {
        const comms = await API.getComments(selectedPost.id);
        setComments(comms);
      }
    } catch (e) {
      setMessage(e?.response?.data?.error || 'Error setting interesting');
    }
  }

  async function handleUnsetInteresting(commentId) {
    try {
      await API.unsetInteresting(commentId);
      if (user && selectedPost) {
        const comms = await API.getComments(selectedPost.id);
        setComments(comms);
      }
    } catch (e) {
      setMessage(e?.response?.data?.error || 'Error unsetting interesting');
    }
  }

  // --- Routing ---
  return (
    <div className="px-3 py-4" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e3f0ff 0%, #fafcff 100%)' }}>
      <Routes>
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" />
            ) : (
              <Row className="justify-content-center">
                <Col xs={12} sm={10} md={8} lg={5}>
                  <div className="card shadow-lg border-0" style={{ background: '#f8f9fa' }}>
                    <div className="card-body">
                      <LoginForm onLogin={handleLogin} totpRequired={totpRequired} onTotp={handleTotp} />
                    </div>
                  </div>
                </Col>
              </Row>
            )
          }
        />
        <Route
          path="*"
          element={
            <Row className="justify-content-center mt-5">
              <Col xs={12} md={8} className="text-center">
                <h2 className="text-danger">404 - Page Not Found</h2>
                <a href="/" className="btn btn-primary mt-3">Go to Posts</a>
              </Col>
            </Row>
          }
        />
        <Route
          path="/"
          element={
            <Layout
              user={user}
              posts={posts}
              selectedPost={selectedPost}
              comments={comments}
              message={message}
              onLogout={handleLogout}
              onAddPost={handleAddPost}
              onSelectPost={handleSelectPost}
              onDeletePost={handleDeletePost}
              onAddComment={handleAddComment}
              onEditComment={handleEditComment}
              onDeleteComment={handleDeleteComment}
              onSetInteresting={handleSetInteresting}
              onUnsetInteresting={handleUnsetInteresting}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
