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
import { Row, Col, Button } from 'react-bootstrap';

// --- Main App ---
function App() {

  // User information
  const [user, setUser] = useState(null);

  // If TOTP is required for the user
  const [totpRequired, setTotpRequired] = useState(false);

  // Pending admin user data (for TOTP verification)
  const [pendingAdminUser, setPendingAdminUser] = useState(null);

  // State for posts, selected post, comments, and messages
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('danger');

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

  // Load comments when a post is selected (for both authenticated and unauthenticated users)
  useEffect(() => {
    if (selectedPost) {
      API.getComments(selectedPost.id)
        .then(setComments)
        .catch(() => setMessage('Error loading comments'));
    } else {
      setComments([]);
    }
  }, [selectedPost]);

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
        setPendingAdminUser(res); // Store the admin user data
        setUser(null); // Do not set user yet, wait for TOTP verification
      } else {
        setUser({ ...res, isTotp: true });
        setTotpRequired(false);
        setPendingAdminUser(null);
        navigate('/');
      }
      setMessage('');
    } catch (err) {
      // Clear any existing state
      setUser(null);
      setTotpRequired(false);
      setPendingAdminUser(null);
      setMessage('');
      // Throw error to be handled by LoginForm
      throw new Error(err.error || 'Login failed. Please check your credentials.');
    }
  }

  async function handleTotp(code) {
    try {
      await API.logInTotp(code);
      const u = await API.getUserInfo();
      setUser(u); // Full admin privileges after TOTP
      setTotpRequired(false);
      setPendingAdminUser(null);
      setMessage('');
      navigate('/');
    } catch (err) {
      // Throw error to be handled by LoginForm
      throw new Error(err.error || 'Invalid TOTP code. Please try again.');
    }
  }

  async function handleSkipTotp() {
    // Allow admin to continue with limited privileges (as regular user)
    if (pendingAdminUser) {
      // Set user but mark as having limited privileges (no admin rights)
      setUser({ 
        ...pendingAdminUser, 
        is_admin: false, // Remove admin privileges
        limited_access: true, // Flag to indicate this is limited access
        original_admin: true // Remember they were originally an admin
      });
      setTotpRequired(false);
      setPendingAdminUser(null);
      setMessage('Logged in with limited access. Complete 2FA for full admin privileges.');
      setMessageType('warning');
      setTimeout(() => setMessage(''), 2000);
      navigate('/');
    }
  }

  async function handleLogout() {
    await API.logOut();
    setUser(null);
    setTotpRequired(false);
    setPendingAdminUser(null);
    setSelectedPost(null);
    setComments([]);
    setMessage('');
    navigate('/login'); // This ensures redirect to login after logout
  }

  // --- Post handlers ---
  async function handleSelectPost(post) {
    setSelectedPost(post);
    setComments([]);
    try {
      const comms = await API.getComments(post.id);
      setComments(comms);
    } catch {
      setMessage('Error loading comments');
    }
  }

  async function handleAddPost(post) {
    if (!post.title.trim() || !post.text.trim()) {
      setMessage('Title and text are required');
      setMessageType('danger');
      setTimeout(() => setMessage(''), 2000);
      return;
    }
    try {
      await API.addPost(post);
      await refreshPosts();
      setMessage('Post added successfully!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 2000);
    } catch (e) {
      setMessage(e?.response?.data?.error || 'Error adding post');
      setMessageType('danger');
      setTimeout(() => setMessage(''), 2000);
    }
  }

  async function handleDeletePost(postId) {
    try {
      await API.deletePost(postId);
      await refreshPosts();
      setSelectedPost(null);
      setComments([]);
      setMessage('Post deleted successfully!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 2000);
    } catch (e) {
      setMessage(e?.error || 'Error deleting post');
      setMessageType('danger');
      setTimeout(() => setMessage(''), 2000);
    }
  }

  // If you have post editing, also call await refreshPosts() after editing.

  // --- Comment handlers ---
  async function handleAddComment(postId, text) {
    if (!text.trim()) {
      setMessage('Comment text is required');
      setMessageType('danger');
      setTimeout(() => setMessage(''), 2000);
      return;
    }
    try {
      await API.addComment(postId, text);
      // Refresh comments for all users (both authenticated and unauthenticated)
      const comms = await API.getComments(postId);
      setComments(comms);
      setMessage('Comment added successfully!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 2000);
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
      setMessageType('danger');
      setTimeout(() => setMessage(''), 2000);
    }
  }

  async function handleEditComment(commentId, text) {
    if (!text.trim()) {
      setMessage('Comment text is required');
      setMessageType('danger');
      setTimeout(() => setMessage(''), 2000);
      return;
    }
    try {
      await API.editComment(commentId, text);
      if (selectedPost) {
        const comms = await API.getComments(selectedPost.id);
        setComments(comms);
      }
      setMessage('Comment edited successfully!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 2000);
    } catch (e) {
      setMessage(e?.response?.data?.error || 'Error editing comment');
      setMessageType('danger');
      setTimeout(() => setMessage(''), 2000);
    }
  }

  async function handleDeleteComment(commentId) {
    try {
      await API.deleteComment(commentId);
      if (selectedPost) {
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
      setMessage('Comment deleted successfully!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 2000);
    } catch (e) {
      setMessage(e?.response?.data?.error || 'Error deleting comment');
      setMessageType('danger');
      setTimeout(() => setMessage(''), 2000);
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
    <div className="px-3 py-4" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #1e40af 100%)' }}>
      <Routes>
        <Route 
          path="/" 
          element={
            <Layout
              user={user}
              posts={posts}
              selectedPost={selectedPost}
              comments={comments}
              message={message}
              messageType={messageType}
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
        >
          <Route 
            index 
            element={
              <div>
                {/* Main forum view - shows post list and details */}
              </div>
            } 
          />
          <Route 
            path="post/:postId" 
            element={
              <div>
                {/* Individual post view */}
              </div>
            } 
          />
        </Route>
        <Route
          path="/login"
          element={
            !user ? (
              <Row className="justify-content-center">
                <Col xs={12} sm={10} md={8} lg={5}>
                  <div className="card shadow-lg border-0" style={{ background: 'rgba(255, 255, 255, 0.95)', borderRadius: '15px' }}>
                    <div className="card-body">
                      <LoginForm 
                        onLogin={handleLogin} 
                        totpRequired={totpRequired} 
                        onTotp={handleTotp}
                        onSkipTotp={handleSkipTotp}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
            ) : (
              <Navigate replace to='/' />
            )
          }
        />
        {/* 404 Not Found Route - Must be last and replaces entire page */}
        <Route
          path="*"
          element={
            <Row className="justify-content-center mt-5">
              <Col xs={12} md={8} className="text-center">
                <div className="card shadow-lg border-0" style={{ background: 'rgba(255, 255, 255, 0.95)', borderRadius: '15px' }}>
                  <div className="card-body p-5">
                    <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{ width: '100px', height: '100px', background: 'linear-gradient(45deg, #dc2626, #ef4444)' }}>
                      <i className="bi bi-exclamation-triangle-fill text-white" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <h2 className="text-danger mb-4 fw-bold">404 - Page Not Found</h2>
                    <p className="lead text-muted mb-4">
                      Sorry, the page you are looking for doesn't exist or has been moved.
                    </p>
                    <div className="d-flex gap-3 justify-content-center flex-wrap">
                      <Button 
                        variant="primary" 
                        size="lg" 
                        onClick={() => navigate('/')}
                        style={{ borderRadius: '25px' }}
                      >
                        <i className="bi bi-house-fill me-2"></i>
                        Go to Forum
                      </Button>
                      <Button 
                        variant="outline-primary" 
                        size="lg" 
                        onClick={() => navigate('/login')}
                        style={{ borderRadius: '25px' }}
                      >
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Login
                      </Button>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
