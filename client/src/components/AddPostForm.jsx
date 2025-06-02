// -----------------------------------------------------------------------------
// AddPostForm Component
// -----------------------------------------------------------------------------
// This component renders a form that allows users to add new posts to the forum.
// Users can specify a title, content, and an optional maximum number of comments.
// The form validates required fields and resets after submission.
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

function AddPostForm({ onAdd }) {
  // State to manage the title input
  const [title, setTitle] = useState('');
  // State to manage the content input
  const [text, setText] = useState('');
  // State to manage the optional maximum comments input
  const [maxComments, setMaxComments] = useState('');

  // Handle form submission
  const handleSubmit = e => {
    // Prevent default form submission behavior
    e.preventDefault();
    // Trigger the callback to add the post with the provided data
    onAdd({ title, text, max_comments: maxComments ? Number(maxComments) : null });
    // Reset the form fields after submission
    setTitle('');
    setText('');
    setMaxComments('');
  };

  return (
    // Form container with styling and submission handler
    <Form onSubmit={handleSubmit} className="card card-body mb-4 shadow border-0" style={{ background: '#e3f0ff' }}>
      {/* Form header */}
      <h5 className="mb-3 text-primary"><i className="bi bi-plus-circle"></i> Add Post</h5>
      {/* Input field for the post title */}
      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Enter post title"
          required
        />
      </Form.Group>
      {/* Textarea for the post content */}
      <Form.Group className="mb-3">
        <Form.Label>Content</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Write your post content"
          required
        />
      </Form.Group>
      {/* Input field for the optional maximum comments */}
      <Form.Group className="mb-3">
        <Form.Label>Max Comments (optional)</Form.Label>
        <Form.Control
          type="number"
          min="1"
          value={maxComments}
          onChange={e => setMaxComments(e.target.value)}
          placeholder="Enter maximum number of comments"
        />
      </Form.Group>
      {/* Submit button */}
      <Button type="submit" variant="primary">
        <i className="bi bi-plus-circle"></i> Add Post
      </Button>
    </Form>
  );
}

export default AddPostForm;
