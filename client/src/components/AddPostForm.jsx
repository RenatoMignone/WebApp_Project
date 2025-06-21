import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import API from '../API';

function AddPostForm({ onPostsChange, showMessage }) {

  // State to manage the title input
  const [title, setTitle] = useState('');
  // State to manage the content input
  const [text, setText] = useState('');
  // State to manage the optional maximum comments input
  const [maxComments, setMaxComments] = useState('');

  // ############################################################################
  // HANDLERS
  // ############################################################################

  // Handle form submission
  const handleSubmit = async e => {
    // Prevent default form submission behavior
    e.preventDefault();
    
    if (!title.trim() || !text.trim()) {
      showMessage('Title and text are required');
      return;
    }

    try {
      // Handle max_comments: empty string should be null (unlimited)
      const maxCommentsValue = maxComments.trim() === '' ? null : Number(maxComments);
      
      await API.addPost({ 
        title, 
        text, 
        max_comments: maxCommentsValue
      });
      
      // Refresh posts list
      const posts = await API.getPosts();
      onPostsChange(posts);
      
      // Reset the form fields after submission
      setTitle('');
      setText('');
      setMaxComments('');
      
      showMessage('Post added successfully!', 'success');
    } catch (e) {
      showMessage(e?.response?.data?.error || 'Error adding post');
    }
  };

  //-----------------------------------------------------------------------------
  // Render the form for adding a new post
  return (
    // Form container with styling and submission handler
    <Form onSubmit={handleSubmit} className="card border-0 shadow-lg mb-4" style={{ background: 'rgba(255, 255, 255, 0.95)', borderRadius: '15px' }}>
      <div className="card-body p-4">
        {/* Form header */}
        <h5 className="mb-4 fw-bold" style={{ color: '#1e40af' }}>
          <i className="bi bi-plus-circle-fill me-2"></i>
          Create New Post
        </h5>
        
        {/* Input field for the post title */}
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold text-dark">Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Enter an engaging post title"
            required
            className="border-0 shadow-sm"
            style={{ borderRadius: '10px', padding: '12px 16px', background: '#f8fafc' }}
          />
        </Form.Group>

        {/* Textarea for the post content */}
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold text-dark">Content</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Share your thoughts, insights, or questions..."
            required
            className="border-0 shadow-sm"
            style={{ borderRadius: '10px', padding: '12px 16px', background: '#f8fafc' }}
          />
        </Form.Group>

        {/* Input field for the optional maximum comments */}
        <Form.Group className="mb-4">
          <Form.Label className="fw-bold text-dark">Max Comments (optional)</Form.Label>
          <Form.Control
            type="number"
            min="0"
            value={maxComments}
            onChange={e => setMaxComments(e.target.value)}
            placeholder="Leave blank for unlimited, 0 to disable"
            className="border-0 shadow-sm"
            style={{ borderRadius: '10px', padding: '12px 16px', background: '#f8fafc' }}
          />
        </Form.Group>
        
        {/* Submit button */}
        <Button 
          type="submit" 
          className="w-100 fw-bold border-0 shadow-sm"
          style={{ 
            borderRadius: '10px',
            background: 'linear-gradient(90deg, #1e40af 0%, #3b82f6 100%)',
            padding: '12px'
          }}
        >
          <i className="bi bi-send-fill me-2"></i>
          Publish Post
        </Button>
        
      </div>
    </Form>
  );
}

//-----------------------------------------------------------------------------
export default AddPostForm;
