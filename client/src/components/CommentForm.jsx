// -----------------------------------------------------------------------------
// CommentForm Component
// -----------------------------------------------------------------------------
// This component renders a form that allows users to input and save comments.
// It includes a controlled textarea and a submit button.
// -----------------------------------------------------------------------------

// This file defines a React component for a comment form.
// The form allows users to input and save comments, with a controlled textarea and a submit button.

import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

// CommentForm is a functional component that manages a text input and handles form submission.
function CommentForm({ initialText = '', onSave }) {

  // ###########################################################################
  // STATE MANAGEMENT
  // ###########################################################################
  
  // useState hook is used to manage the state of the text input.
  const [text, setText] = useState(initialText);


  // ############################################################################
  // HANDLERS
  // ############################################################################

  // handleSubmit is triggered when the form is submitted.
  const handleSubmit = (e) => {
    e.preventDefault(); 
    onSave(text);
    setText(''); 
  }
  //-----------------------------------------------------------------------------
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

//-----------------------------------------------------------------------------
// Exports the CommentForm component for use in other parts of the application.
export default CommentForm;
