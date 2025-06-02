// -----------------------------------------------------------------------------
// AddCommentForm Component
// -----------------------------------------------------------------------------
// This component renders a form that allows users to add comments to a specific post.
// - Authenticated users can add comments with their identity.
// - Anonymous users can add comments without authentication.
// - The form dynamically adjusts its placeholder and button text based on the user's authentication status.
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';

function AddCommentForm({ user, post, onAddComment }) {
  // State to manage the text input for the comment
  const [text, setText] = useState('');

  // If no post is selected, do not render the form
  if (!post) return null;

  // Handle form submission
  const handleSubmit = e => {
    e.preventDefault();           // Prevent default form submission behavior
    onAddComment(post.id, text);  // Trigger the callback to add the comment
    setText('');                  // Clear the input field after submission
  };


  return (
    <Form className="mb-2 mt-3" onSubmit={handleSubmit}>
      <InputGroup>
        {/* Textarea for entering the comment */}
        <Form.Control
          as="textarea"
          value={text}                                                            // Bind the textarea value to the state
          onChange={e => setText(e.target.value)}                                 // Update state as the user types
          placeholder={user ? "Add a comment..." : "Add an anonymous comment..."} // Dynamic placeholder based on user authentication
          required
          rows={2} 
        />
        {/* Submit button */}
        <Button variant="info" type="submit" className="text-white">
          <i className="bi bi-send"></i> {user ? "Add Comment" : "Add Anonymous Comment"} 
        </Button>
      </InputGroup>
    </Form>
  );
}

export default AddCommentForm;
