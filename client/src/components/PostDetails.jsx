import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Modal, Button } from 'react-bootstrap';

function PostDetails({ post, user, onDeletePost }) {
  const [showModal, setShowModal] = useState(false);

  if (!post) return null;

  // Determine if the user can delete this post
  const canDelete =
    user &&
    (user.id === post.author_id ||
      (user.is_admin && user.isTotp));

  return (
    <div className="mt-2">
      <div className="card mb-3 border-3 border-primary" style={{ background: '#f8faff' }}>
        <div className="card-header d-flex justify-content-between align-items-center bg-primary bg-gradient text-white">
          <span className="fw-bold">{post.title}</span>
          {onDeletePost && (
            <>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => canDelete && setShowModal(true)}
                disabled={!canDelete}
                title={
                  canDelete
                    ? "Delete Post"
                    : "You are not allowed to delete this post"
                }
              >
                <i className="bi bi-trash"></i> Delete Post
              </button>
              <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                  <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Are you sure you want to delete this post?
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="danger" onClick={() => { setShowModal(false); onDeletePost(post.id); }}>
                    Delete
                  </Button>
                </Modal.Footer>
              </Modal>
            </>
          )}
        </div>
        <div className="card-body">
          <div className="mb-2"><i className="bi bi-person"></i> <span className="fw-bold">{post.author}</span></div>
          <div className="mb-2"><i className="bi bi-calendar"></i> {post.timestamp && dayjs(post.timestamp).format('YYYY-MM-DD HH:mm')}</div>
          <div className="mb-2"><i className="bi bi-chat-left-text"></i> Max Comments: {post.max_comments ?? '∞'}</div>
          <div style={{ whiteSpace: 'pre-line' }}>{post.text}</div>
        </div>
      </div>
    </div>
  );
}

export default PostDetails;
