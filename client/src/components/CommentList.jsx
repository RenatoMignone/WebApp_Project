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
      <div className="bg-gradient p-2 rounded-top" style={{ background: 'linear-gradient(90deg, #6fd6ff 0%, #4f8cff 100%)', color: '#fff' }}>
        <h5 className="mb-0"><i className="bi bi-chat-left-text"></i> Comments</h5>
      </div>
      <ListGroup className="mb-3">
        {sortedComments.map(c => (
          <ListGroup.Item key={c.id} className="d-flex justify-content-between align-items-start" style={{ background: '#f8faff' }}>
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
                    className="form-control mb-2"
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    rows={2}
                    autoFocus
                  />
                  <div>
                    {/* Buttons to save or cancel editing */}
                    <Button type="submit" variant="success" size="sm" className="me-2">
                      Save
                    </Button>
                    <Button variant="secondary" size="sm" onClick={cancelEdit}>
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  {/* Display the comment text */}
                  <span style={{ whiteSpace: 'pre-line' }}>{c.text}</span>
                  <br />
                  <small className="text-muted">
                    {/* Display author and timestamp */}
                    {c.author ? `by ${c.author}` : 'anonymous'} - {c.timestamp && dayjs(c.timestamp).format('YYYY-MM-DD HH:mm')}
                    {' | '}Interesting: {c.interesting_count}
                  </small>
                </>
              )}
            </div>
            <div className="btn-group btn-group-sm ms-2">
              {/* Buttons for marking as interesting, editing, or deleting */}
              {user && (
                c.interesting
                  ? <Button variant="warning" size="sm" title="Unflag" onClick={() => onUnsetInteresting(c.id)}><i className="bi bi-star-fill"></i></Button>
                  : <Button variant="outline-warning" size="sm" title="Flag as interesting" onClick={() => onSetInteresting(c.id)}><i className="bi bi-star"></i></Button>
              )}
              {user && (user.id === c.author_id || (user.is_admin && user.isTotp)) && (
                <>
                  {editingId === c.id ? null : (
                    <Button variant="outline-primary" size="sm" title="Edit" onClick={() => startEdit(c)}>
                      <i className="bi bi-pencil"></i>
                    </Button>
                  )}
                  <Button variant="outline-danger" size="sm" title="Delete" onClick={() => onDeleteComment(c.id)}>
                    <i className="bi bi-trash"></i>
                  </Button>
                </>
              )}
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default CommentList;
