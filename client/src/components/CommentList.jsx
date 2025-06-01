import React, { useState } from 'react';
import dayjs from 'dayjs';

function CommentList({ comments, user, onEditComment, onDeleteComment, onSetInteresting, onUnsetInteresting }) {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const startEdit = (c) => {
    setEditingId(c.id);
    setEditText(c.text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const saveEdit = (id) => {
    if (editText.trim()) {
      onEditComment(id, editText);
      setEditingId(null);
      setEditText('');
    }
  };

  const sortedComments = [...comments].sort((a, b) => b.timestamp - a.timestamp); // Sort by timestamp descending

  if (!comments || comments.length === 0) {
    return <div className="text-muted">No comments yet.</div>;
  }
  return (
    <div className="mt-4">
      <div className="bg-gradient p-2 rounded-top" style={{ background: 'linear-gradient(90deg, #6fd6ff 0%, #4f8cff 100%)', color: '#fff' }}>
        <h5 className="mb-0"><i className="bi bi-chat-left-text"></i> Comments</h5>
      </div>
      <ul className="list-group mb-3">
        {sortedComments.map(c => (
          <li key={c.id} className="list-group-item" style={{ background: '#f8faff' }}>
            <div className="d-flex justify-content-between align-items-start">
              <div style={{ flex: 1 }}>
                {editingId === c.id ? (
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      saveEdit(c.id);
                    }}
                  >
                    <textarea
                      className="form-control mb-2"
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      rows={2}
                      autoFocus
                    />
                    <div>
                      <button type="submit" className="btn btn-success btn-sm me-2">
                        Save
                      </button>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={cancelEdit}>
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <span style={{ whiteSpace: 'pre-line' }}>{c.text}</span>
                    <br />
                    <small className="text-muted">
                      {c.author ? `by ${c.author}` : 'anonymous'} - {c.timestamp && dayjs(c.timestamp).format('YYYY-MM-DD HH:mm')}
                      {' | '}Interesting: {c.interesting_count}
                    </small>
                  </>
                )}
              </div>
              <div className="btn-group btn-group-sm ms-2">
                {user && (
                  c.interesting
                    ? <button className="btn btn-warning" title="Unflag" onClick={() => onUnsetInteresting(c.id)}><i className="bi bi-star-fill"></i></button>
                    : <button className="btn btn-outline-warning" title="Flag as interesting" onClick={() => onSetInteresting(c.id)}><i className="bi bi-star"></i></button>
                )}
                {user && (user.id === c.author_id || (user.is_admin && user.isTotp)) && (
                  <>
                    {editingId === c.id ? null : (
                      <button className="btn btn-outline-primary" title="Edit" onClick={() => startEdit(c)}>
                        <i className="bi bi-pencil"></i>
                      </button>
                    )}
                    <button className="btn btn-outline-danger" title="Delete" onClick={() => onDeleteComment(c.id)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CommentList;
