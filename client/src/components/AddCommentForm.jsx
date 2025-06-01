import React, { useState } from 'react';

function AddCommentForm({ user, post, onAddComment }) {
  const [text, setText] = useState('');
  if (!post) return null;
  const handleSubmit = e => {
    e.preventDefault();
    onAddComment(post.id, text);
    setText('');
  };
  return (
    <form className="mb-2 mt-3" onSubmit={handleSubmit}>
      <div className="input-group">
        <textarea
          className="form-control"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={user ? "Add a comment..." : "Add an anonymous comment..."}
          required
          rows={2}
        />
        <button className="btn btn-info text-white" type="submit">
          <i className="bi bi-send"></i> {user ? "Add Comment" : "Add Anonymous Comment"}
        </button>
      </div>
    </form>
  );
}

export default AddCommentForm;
