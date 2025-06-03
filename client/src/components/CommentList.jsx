// -----------------------------------------------------------------------------
// CommentList Component
// -----------------------------------------------------------------------------
// This component displays a list of comments for a post. It includes functionality
// for editing, deleting, and marking comments as interesting.
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import dayjs from 'dayjs';
import { ListGroup, Button } from 'react-bootstrap';

function CommentList({ comments, user, onEditComment, onDeleteComment, onSetInteresting, onUnsetInteresting }) {
  // State to track the currently editing comment
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  // Start editing a comment
  const startEdit = (c) => {
    setEditingId(c.id);
    setEditText(c.text);
  };

  // Cancel editing a comment
  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  // Save the edited comment
  const saveEdit = (id) => {
    if (editText.trim()) {
      onEditComment(id, editText);
      setEditingId(null);
      setEditText('');
    }
  };

  // Sort comments by timestamp in descending order
  const sortedComments = [...comments].sort((a, b) => b.timestamp - a.timestamp);

  // Display a message if there are no comments
  if (!comments || comments.length === 0) {
    return <div className="text-muted">No comments yet.</div>;
  }

  return (
    <div className="mt-4">
      {/* Header for the comments section */}
      <div className="p-3 rounded-top text-white shadow-sm" style={{ background: 'linear-gradient(90deg, #1e40af 0%, #3b82f6 100%)' }}>
        <h5 className="mb-0 fw-bold">
          <i className="bi bi-chat-left-text me-2"></i>
          Comments ({comments.length})
        </h5>
      </div>
      <div className="border-0 shadow-sm" style={{ background: '#ffffff', borderRadius: '0 0 15px 15px' }}>
        {sortedComments.map((c, index) => (
          <div 
            key={c.id} 
            className={`p-4 ${index < sortedComments.length - 1 ? 'border-bottom' : ''}`}
            style={{ 
              borderBottomColor: '#e5e7eb',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid'
            }}
          >
            <div className="d-flex justify-content-between align-items-start">
              <div style={{ flex: 1 }}>
                {/* Render the comment text or an editing form */}
                {editingId === c.id ? (
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      saveEdit(c.id);
                    }}
                  >
                    {/* Textarea for editing the comment */}
                    <textarea
                      className="form-control mb-3 border-0 shadow-sm"
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      rows={3}
                      autoFocus
                      style={{ borderRadius: '10px', background: '#f8fafc' }}
                    />
                    <div>
                      {/* Buttons to save or cancel editing */}
                      <Button type="submit" variant="success" size="sm" className="me-2" style={{ borderRadius: '20px' }}>
                        <i className="bi bi-check-lg me-1"></i>
                        Save
                      </Button>
                      <Button variant="outline-secondary" size="sm" onClick={cancelEdit} style={{ borderRadius: '20px' }}>
                        <i className="bi bi-x-lg me-1"></i>
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <>
                    {/* Display the comment text */}
                    <div className="mb-2" style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>{c.text}</div>
                    <div className="d-flex align-items-center text-muted small">
                      {/* Display author and timestamp */}
                      <div className="d-flex align-items-center me-3">
                        <i className="bi bi-person-circle me-1"></i>
                        <span className="fw-medium">{c.author || 'Anonymous'}</span>
                      </div>
                      <div className="d-flex align-items-center me-3">
                        <i className="bi bi-clock me-1"></i>
                        <span>{c.timestamp && dayjs(c.timestamp).format('MMM DD, YYYY HH:mm')}</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-star-fill me-1 text-warning"></i>
                        <span className="fw-medium">{c.interesting_count}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="ms-3">
                {/* Buttons for marking as interesting, editing, or deleting */}
                <div className="d-flex gap-1">
                  {user && (
                    <Button
                      variant={c.interesting ? "warning" : "outline-warning"}
                      size="sm"
                      title={c.interesting ? "Remove from interesting" : "Mark as interesting"}
                      onClick={() => c.interesting ? onUnsetInteresting(c.id) : onSetInteresting(c.id)}
                      style={{ borderRadius: '50%', width: '32px', height: '32px', padding: '0' }}
                    >
                      <i className={`bi ${c.interesting ? 'bi-star-fill' : 'bi-star'}`}></i>
                    </Button>
                  )}
                  {user && (user.id === c.author_id || (user.is_admin && user.isTotp)) && (
                    <>
                      {editingId === c.id ? null : (
                        <Button
                          variant="outline-primary"
                          size="sm"
                          title="Edit comment"
                          onClick={() => startEdit(c)}
                          style={{ borderRadius: '50%', width: '32px', height: '32px', padding: '0' }}
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>
                      )}
                      <Button
                        variant="outline-danger"
                        size="sm"
                        title="Delete comment"
                        onClick={() => onDeleteComment(c.id)}
                        style={{ borderRadius: '50%', width: '32px', height: '32px', padding: '0' }}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentList;
