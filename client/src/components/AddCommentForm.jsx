// -----------------------------------------------------------------------------
// AddCommentForm Component
// -----------------------------------------------------------------------------
// This component renders a form that allows users to add comments to a specific post.
// - Authenticated users can add comments with their identity.
// - Anonymous users can add comments without authentication.
// - The form dynamically adjusts its placeholder and button text based on the user's authentication status.
// - Commenting can be disabled by the post author (max_comments = 0).
// -----------------------------------------------------------------------------

import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import API from '../API';

function AddCommentForm({ user, post, onCommentsChange, showMessage }) {

  // ###########################################################################
  // STATE MANAGEMENT
  // ###########################################################################

  // State to manage the text input for the comment
  const [text, setText] = useState('');

  // If no post is selected, do not render the form
  if (!post) return null;

  // Check if commenting is disabled (max_comments = 0)
  const isCommentingDisabled = post.max_comments === 0;

  // ############################################################################
  // HANDLERS
  // ############################################################################

  // Handle form submission for adding a comment
  const handleSubmit = async e => {
    e.preventDefault();           // Prevent default form submission behavior
    if (isCommentingDisabled) return; // Prevent submission if commenting is disabled
    
    if (!text.trim()) {
      showMessage('Comment text is required');
      return;
    }
    
    try {
      await API.addComment(post.id, text);
      const updatedComments = await API.getComments(post.id);
      onCommentsChange(updatedComments);
      setText('');                  // Clear the input field after submission
      showMessage('Comment added successfully!', 'success');
    } catch (e) {
      showMessage(e?.response?.data?.error || 'Error adding comhttps://totp.danhersam.com/ment');
    }
  };

  //-----------------------------------------------------------------------------
  // If commenting is disabled, show a message instead of the form
  if (isCommentingDisabled) {
    return (
      <div className="mt-4">
        <div className="card border-0 shadow-sm" style={{ background: 'rgba(255, 255, 255, 0.95)', borderRadius: '15px' }}>
          <div className="card-body p-4 text-center">
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

  //-----------------------------------------------------------------------------
  return (
    // THis classname is used to style the form container
    <div className="mt-4">
      {/* Card to contain the comment form */}
      <div className="card border-0 shadow-sm" style={{ background: 'rgba(255, 255, 255, 0.95)', borderRadius: '15px' }}>
        <div className="card-body p-4">
          {/* Header for the comment form */}
          <h6 className="mb-3 fw-bold" style={{ color: '#1e40af' }}>
            {user ? "Add Your Comment" : "Add Anonymous Comment"}
          </h6>

          {/* Form for adding a comment */}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              {/* Textarea for entering the comment */}
              <Form.Control
                as="textarea"
                value={text}
                onChange={e => setText(e.target.value)}
                // If the user is authenticated, use a different placeholder
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

//-----------------------------------------------------------------------------
export default AddCommentForm;
