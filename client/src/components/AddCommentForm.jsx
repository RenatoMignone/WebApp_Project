// -----------------------------------------------------------------------------
// AddCommentForm Component
// -----------------------------------------------------------------------------
// This component renders a form that allows users to add comments to a specific post.
// - Authenticated users can add comments with their identity.
// - Anonymous users can add comments without authentication.
// - The form dynamically adjusts its placeholder and button text based on the user's authentication status.
// - Commenting can be disabled by the post author (max_comments = 0).
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';

function AddCommentForm({ user, post, onAddComment }) {
  // State to manage the text input for the comment
  const [text, setText] = useState('');

  // If no post is selected, do not render the form
  if (!post) return null;

  // Check if commenting is disabled (max_comments = 0)
  const isCommentingDisabled = post.max_comments === 0;

  // Handle form submission
  const handleSubmit = e => {
    e.preventDefault();           // Prevent default form submission behavior
    if (isCommentingDisabled) return; // Prevent submission if commenting is disabled
    onAddComment(post.id, text);  // Trigger the callback to add the comment
    setText('');                  // Clear the input field after submission
  };

  // If commenting is disabled, show a message instead of the form
  if (isCommentingDisabled) {
    return (
      <div className="mt-4">
        <div className="card border-0 shadow-sm" style={{ background: 'rgba(255, 255, 255, 0.95)', borderRadius: '15px' }}>
          <div className="card-body p-4 text-center">
            <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px', background: 'linear-gradient(45deg, #dc2626, #ef4444)' }}>
              <i className="bi bi-chat-slash-fill text-white" style={{ fontSize: '1.5rem' }}></i>
            </div>
            <h6 className="mb-2 fw-bold text-muted">
              Comments Disabled
            </h6>
            <p className="small text-muted mb-0">
              The author has disabled comments for this post.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="card border-0 shadow-sm" style={{ background: 'rgba(255, 255, 255, 0.95)', borderRadius: '15px' }}>
        <div className="card-body p-4">
          <h6 className="mb-3 fw-bold" style={{ color: '#1e40af' }}>
            <i className="bi bi-chat-left-dots-fill me-2"></i>
            {user ? "Add Your Comment" : "Add Anonymous Comment"}
          </h6>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              {/* Textarea for entering the comment */}
              <Form.Control
                as="textarea"
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder={user ? "Share your thoughts..." : "Share your thoughts anonymously..."}
                required
                rows={3}
                className="border-0 shadow-sm"
                style={{ borderRadius: '10px', padding: '12px 16px', background: '#f8fafc' }}
              />
            </Form.Group>
            {/* Submit button */}
            <Button 
              type="submit" 
              className="fw-bold border-0 shadow-sm"
              style={{ 
                borderRadius: '20px',
                background: 'linear-gradient(90deg, #1e40af 0%, #3b82f6 100%)',
                padding: '8px 20px'
              }}
            >
              <i className="bi bi-send-fill me-2"></i>
              {user ? "Post Comment" : "Post Anonymously"}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default AddCommentForm;
