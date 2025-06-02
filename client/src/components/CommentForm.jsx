// -----------------------------------------------------------------------------
// CommentForm Component
// -----------------------------------------------------------------------------
// This component renders a form that allows users to input and save comments.
// It includes a controlled textarea and a submit button.
// -----------------------------------------------------------------------------

// This file defines a React component for a comment form.
// The form allows users to input and save comments, with a controlled textarea and a submit button.

import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

// CommentForm is a functional component that manages a text input and handles form submission.
function CommentForm({ initialText = '', onSave }) {
  // useState hook is used to manage the state of the text input.
  const [text, setText] = useState(initialText);

  // handleSubmit is triggered when the form is submitted.
  // It prevents the default form submission, calls the onSave callback with the text, and clears the input.
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the default form submission behavior.
    onSave(text); // Calls the onSave function passed as a prop with the current text.
    setText(''); // Resets the text input to an empty string.
  };

  return (
    // The form element wraps the input and submit button.
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        {/* Textarea for user input, controlled by the text state */}
        <Form.Control
          as="textarea"
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your comment..."
          required
        />
      </Form.Group>
      {/* Submit button to save the comment */}
      <Button type="submit" variant="primary">Submit</Button>
    </Form>
  );
}

// Exports the CommentForm component for use in other parts of the application.
export default CommentForm;
