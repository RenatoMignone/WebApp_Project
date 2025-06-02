// -----------------------------------------------------------------------------
// PostDetails Component
// -----------------------------------------------------------------------------
// This component displays detailed information about a selected post. It includes
// functionality for deleting the post if the user has the necessary permissions.
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Card, Modal, Button } from 'react-bootstrap';

function PostDetails({ post, user, onDeletePost }) {
  const [showModal, setShowModal] = useState(false);

  if (!post) return null;

  // Determine if the user can delete this post
  const canDelete =
    user &&
    (user.id === post.author_id ||
      (user.is_admin && user.isTotp));

  return (
    <div className="mt-4 px-3">
      <Card className="mb-3 border-3 border-primary" style={{ background: '#f8faff' }}>
        <Card.Header className="d-flex justify-content-between align-items-center bg-primary bg-gradient text-white">
          <span className="fw-bold">{post.title}</span>
          {onDeletePost && (
            <>
              {/* Button to trigger the delete confirmation modal */}
              <Button
                variant="danger"
                size="sm"
                onClick={() => canDelete && setShowModal(true)}
                disabled={!canDelete}
                title={
                  canDelete
                    ? "Delete Post"
                    : "You are not allowed to delete this post"
                }
              >
                <i className="bi bi-trash"></i> Delete Post
              </Button>
              {/* Delete confirmation modal */}
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
        </Card.Header>
        <Card.Body>
          {/* Display post details */}
          <div className="mb-2"><i className="bi bi-person"></i> <span className="fw-bold">{post.author}</span></div>
          <div className="mb-2"><i className="bi bi-calendar"></i> {post.timestamp && dayjs(post.timestamp).format('YYYY-MM-DD HH:mm')}</div>
          <div className="mb-2"><i className="bi bi-chat-left-text"></i> Max Comments: {post.max_comments ?? '∞'}</div>
          <div style={{ whiteSpace: 'pre-line' }}>{post.text}</div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default PostDetails;
