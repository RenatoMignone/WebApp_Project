import React, { useState } from 'react';

function AddPostForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [maxComments, setMaxComments] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    onAdd({ title, text, max_comments: maxComments ? Number(maxComments) : null });
    setTitle('');
    setText('');
    setMaxComments('');
  };

  return (
    <form className="card card-body mb-4 shadow border-0" style={{ background: '#e3f0ff' }} onSubmit={handleSubmit}>
      <h5 className="mb-3 text-primary"><i className="bi bi-plus-circle"></i> Add Post</h5>
      <div className="mb-2">
        <input className="form-control" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
      </div>
      <div className="mb-2">
        <textarea className="form-control" value={text} onChange={e => setText(e.target.value)} placeholder="Content" required rows={3} />
      </div>
      <div className="mb-2">
        <input className="form-control" type="number" min="1" value={maxComments} onChange={e => setMaxComments(e.target.value)} placeholder="Max Comments (optional)" />
      </div>
      <button className="btn btn-primary" type="submit"><i className="bi bi-plus-circle"></i> Add Post</button>
    </form>
  );
}

export default AddPostForm;
