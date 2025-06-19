import { useState, useEffect } from 'react';
import { Row, Col, Button, Alert} from 'react-bootstrap';
import { Link, Outlet, useLocation } from 'react-router-dom';
import API from '../API';

import NavigationBar from './NavigationBar';
import AddPostForm from './AddPostForm';
import PostList from './PostList';
import PostDetails from './PostDetails';
import CommentList from './CommentList';
import AddCommentForm from './AddCommentForm';
import LoginForm from './LoginForm';


//------------------------------------------------------------------------
// --- Not Found Layout ---
function NotFoundLayout() {
  return (
    <Row className="justify-content-center mt-5">
      <Col xs={12} md={8} className="text-center">
        <div className="card shadow-lg border-0" style={{ background: 'rgba(255, 255, 255, 0.95)', borderRadius: '15px' }}>
          <div className="card-body p-5">
            <h2 className="text-danger mb-4 fw-bold">404 - Page Not Found</h2>
            <p className="lead text-muted mb-4">
              Sorry, the page you are looking for doesn't exist or has been moved.
            </p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Link to="/">
                <Button 
                  variant="primary" 
                  size="lg" 
                  style={{ borderRadius: '25px' }}
                >
                  <i className="bi bi-house-fill me-2"></i>
                  Go to Forum
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
}

//------------------------------------------------------------------------
// --- Login Layout ---
function LoginLayout({ onLogin, totpRequired, onTotp, onSkipTotp }) {
  return (
    <Row className="justify-content-center">
      <Col xs={12} sm={10} md={8} lg={5}>
        <div className="card shadow-lg border-0" style={{ background: 'rgba(255, 255, 255, 0.95)', borderRadius: '15px' }}>
          <div className="card-body">
            <LoginForm 
              onLogin={onLogin} 
              totpRequired={totpRequired} 
              onTotp={onTotp}
              onSkipTotp={onSkipTotp}
            />
          </div>
        </div>
      </Col>
    </Row>
  );
}

//------------------------------------------------------------------------
// --- Add Post Layout ---
function AddPostLayout({ user, onAddPost }) {
  return (
    <Row>
      <Col>
        {user && <AddPostForm onAdd={onAddPost} />}
      </Col>
    </Row>
  );
}

//------------------------------------------------------------------------
// --- Post Details Layout ---
function PostDetailsLayout({ user, selectedPost, showMessage }) {
  const [comments, setComments] = useState([]);

  // Load comments when a post is selected
  useEffect(() => {
    if (selectedPost) {
      API.getComments(selectedPost.id)
        .then(setComments)
        .catch(() => showMessage('Error loading comments'));
    } else {
      setComments([]);
    }
  }, [selectedPost, showMessage]);

  return (
    <Row>
      <Col>
        {selectedPost ? (
          <>
            {/* Part related to the Post Details */}
            <PostDetails 
              post={selectedPost} 
              user={user} 
              showMessage={showMessage}
            />
            <hr />
            {/* Part for the list of comments of one post */}
            <CommentList
              comments={comments}
              user={user}
              selectedPost={selectedPost}
              onCommentsChange={setComments}
              showMessage={showMessage}
            />
            {/* Add a comment on a specific post*/}
            <AddCommentForm 
              user={user} 
              post={selectedPost} 
              onCommentsChange={setComments}
              showMessage={showMessage}
            />
          </>
        ) : (
          <div className="text-center py-5">
            {/* Displayed when the user has not selected any post yet */}
            <div className="card border-0 shadow-lg" style={{ background: 'rgba(255, 255, 255, 0.95)', borderRadius: '20px' }}>
              <div className="card-body p-5">
                <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{ width: '100px', height: '100px', background: 'linear-gradient(45deg, #1e40af, #3b82f6)' }}>
                  <i className="bi bi-chat-dots text-white" style={{ fontSize: '3rem' }}></i>
                </div>
                <h3 className="fw-bold mb-3" style={{ color: '#1e40af' }}>Welcome to the Cybersecurity Forum!</h3>
                <p className="lead text-muted mb-4">Select a post from the sidebar to view details and join the discussion.</p>
                {!user && (
                  <div className="alert alert-info border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                    <i className="bi bi-info-circle-fill me-2"></i>
                    <strong>Sign in</strong> to create posts and interact with the community.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Col>
    </Row>
  );
}

//------------------------------------------------------------------------
// --- Main Forum Layout ---
function ForumLayout({ user, message, messageType = 'danger', onLogout, showMessage }) {

  // ###########################################################################
  // STATE MANAGEMENT
  // ###########################################################################

  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const location = useLocation();

  //----------------------------------------------------------------------------
  return (
    <div className="px-3 py-4">
      <Row>
        <Col>
          <NavigationBar user={user} onLogout={onLogout} />
        </Col>
      </Row>

      <Row>
        <Col>
          {message && (
            <Alert className="my-3 border-0 shadow-sm" variant={messageType} onClose={() => {}} dismissible style={{ borderRadius: '10px' }}>
              <i className={`bi ${messageType === 'success' ? 'bi-check-circle-fill' : messageType === 'warning' ? 'bi-exclamation-triangle-fill' : 'bi-exclamation-triangle-fill'} me-2`}></i>
              {message}
            </Alert>
          )}
        </Col>
      </Row>

      <Row className="g-4">
        <Col xs={12} md={5} lg={4}>
          <div className="sticky-top" style={{ top: '90px' }}>
            {user && (
              <AddPostForm 
                onPostsChange={setPosts}
                showMessage={showMessage}
              />
            )}
            <div className="card shadow-lg border-0 mt-3" style={{ background: 'rgba(255, 255, 255, 0.95)', borderRadius: '15px' }}>
              <div className="card-body p-0">
                <PostList
                  posts={posts}
                  setPosts={setPosts}
                  selectedPost={selectedPost}
                  onSelectPost={setSelectedPost}
                  user={user}
                  showMessage={showMessage}
                />
              </div>
            </div>
          </div>
        </Col>
        <Col xs={12} md={7} lg={8}>
          <Outlet context={{ 
            user,
            selectedPost,
            showMessage
          }} />
          {location.pathname === "/" && (
            <PostDetailsLayout
              user={user}
              selectedPost={selectedPost}
              showMessage={showMessage}
            />
          )}
        </Col>
      </Row>
    </div>
  );
}

//-----------------------------------------------------------------------------
export { NotFoundLayout, LoginLayout, AddPostLayout, ForumLayout };
export default ForumLayout;
