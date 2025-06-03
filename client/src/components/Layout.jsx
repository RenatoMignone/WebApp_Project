import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Alert, Spinner, Toast } from 'react-bootstrap';
import { Link, useParams, Navigate, Outlet } from 'react-router-dom';

import NavigationBar from './NavigationBar';
import AddPostForm from './AddPostForm';
import PostList from './PostList';
import PostDetails from './PostDetails';
import CommentList from './CommentList';
import AddCommentForm from './AddCommentForm';
import API from '../API';

// --- Not Found Layout ---
function NotFoundLayout() {
  return (
    <>
      <h2 className="text-center text-danger">404 - Page Not Found</h2>
      <div className="text-center mt-3">
        <Link to="/">
          <Button variant="primary">Go back to the main page!</Button>
        </Link>
      </div>
    </>
  );
}

// --- Login Layout ---
function LoginLayout({ onLogin, totpRequired, onTotp }) {
  return (
    <Row className="justify-content-center">
      <Col xs={12} sm={10} md={8} lg={5}>
        <div className="card shadow-lg border-0" style={{ background: '#f8f9fa' }}>
          <div className="card-body">
            <h1 className="text-center mb-4">Login</h1>
            <LoginForm onLogin={onLogin} totpRequired={totpRequired} onTotp={onTotp} />
          </div>
        </div>
      </Col>
    </Row>
  );
}

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

// --- Post Details Layout ---
function PostDetailsLayout({
  user,
  selectedPost,
  comments,
  onDeletePost,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onSetInteresting,
  onUnsetInteresting,
}) {
  return (
    <Row>
      <Col>
        {selectedPost ? (
          <>
            <PostDetails post={selectedPost} user={user} onDeletePost={onDeletePost} />
            <hr />
            <CommentList
              comments={comments}
              user={user}
              onEditComment={onEditComment}
              onDeleteComment={onDeleteComment}
              onSetInteresting={onSetInteresting}
              onUnsetInteresting={onUnsetInteresting}
            />
            <AddCommentForm user={user} post={selectedPost} onAddComment={onAddComment} />
          </>
        ) : (
          <div className="text-center py-5">
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


// --- Main Forum Layout ---
function ForumLayout({
  user,
  posts,
  selectedPost,
  comments,
  message,
  messageType = 'danger',
  onLogout,
  onAddPost,
  onSelectPost,
  onDeletePost,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onSetInteresting,
  onUnsetInteresting,
}) {
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
            {user && <AddPostForm onAdd={onAddPost} />}
            <div className="card shadow-lg border-0 mt-3" style={{ background: 'rgba(255, 255, 255, 0.95)', borderRadius: '15px' }}>
              <div className="card-body p-0">
                <PostList
                  posts={posts}
                  onSelect={onSelectPost}
                  selectedPost={selectedPost}
                  user={user}
                />
              </div>
            </div>
          </div>
        </Col>
        <Col xs={12} md={7} lg={8}>
          <PostDetailsLayout
            user={user}
            selectedPost={selectedPost}
            comments={comments}
            onDeletePost={onDeletePost}
            onAddComment={onAddComment}
            onEditComment={onEditComment}
            onDeleteComment={onDeleteComment}
            onSetInteresting={onSetInteresting}
            onUnsetInteresting={onUnsetInteresting}
          />
        </Col>
      </Row>
    </div>
  );
}

export { NotFoundLayout, LoginLayout, AddPostLayout, ForumLayout };
export default ForumLayout;
