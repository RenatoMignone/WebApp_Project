import React, { useState } from 'react';

function CommentForm({ initialText = '', onSave }) {
  const [text, setText] = useState(initialText);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(text);
    setText('');
  };

  return (
    <form className="mb-3" onSubmit={handleSubmit}>
      <div className="input-group">
        <textarea className="form-control" value={text} onChange={e => setText(e.target.value)} required />
        <button className="btn btn-success" type="submit">Save</button>
      </div>
    </form>
  );
}

export default CommentForm;
