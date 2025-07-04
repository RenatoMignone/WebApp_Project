import { useState } from 'react';
import dayjs from 'dayjs';
import { Card, Modal, Button } from 'react-bootstrap';
import API from '../API';
import { useNavigate } from 'react-router-dom';

function PostDetails({ post, user, showMessage, onPostDeleted }) {

  // State to manage the visibility of the delete confirmation modal
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  if (!post) return null;

  // Determine if the user can delete this post
  const canDelete =
    user &&
    (user.id === post.author_id ||
      (user.is_admin && user.isTotp));

  // ###########################################################################
  // HANDLERS
  // ###########################################################################

  // Handle post deletion
  const handleDeletePost = async () => {
    try {
      await API.deletePost(post.id);
      showMessage('Post deleted successfully!', 'success');
      // Call the callback to refresh posts list and clear selection
      if (onPostDeleted) {
        onPostDeleted();
      }
      navigate('/');
    } catch (e) {
      showMessage(e?.response?.data?.error || 'Error deleting post');
    }
    setShowModal(false);
  };

  //-----------------------------------------------------------------------------
  // Render the post details card
  return (
    <div className="mt-4 px-3">
      <Card className="mb-3 border-0 shadow-lg" style={{ background: '#ffffff', borderRadius: '15px' }}>
        <Card.Header className="d-flex justify-content-between align-items-center text-white border-0" style={{ background: 'linear-gradient(90deg, #1e40af 0%, #3b82f6 100%)', borderRadius: '15px 15px 0 0' }}>
          <div>
            <h4 className="mb-1 fw-bold">{post.title}</h4>
            <small className="opacity-75">
              <i className="bi bi-person-fill me-1"></i>
              by {post.author}
            </small>
          </div>
          {canDelete && (
            <>
              {/* Button to trigger the delete confirmation modal */}
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowModal(true)}
                title="Delete Post"
                style={{ borderRadius: '20px' }}
              >
                <i className="bi bi-trash me-1"></i> Delete
              </Button>
              {/* Delete confirmation modal */}
              <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton style={{ background: 'linear-gradient(90deg, #1e40af 0%, #3b82f6 100%)', color: 'white', border: 'none' }}>
                  <Modal.Title>
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    Confirm Delete
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                  <p className="mb-0">Are you sure you want to delete this post? This action cannot be undone.</p>
                </Modal.Body>
                <Modal.Footer className="border-0">
                  <Button variant="outline-secondary" onClick={() => setShowModal(false)} style={{ borderRadius: '20px' }}>
                    Cancel
                  </Button>
                  <Button variant="danger" onClick={handleDeletePost} style={{ borderRadius: '20px' }}>
                    <i className="bi bi-trash me-1"></i>
                    Delete
                  </Button>
                </Modal.Footer>
              </Modal>
            </>
          )}
        </Card.Header>
        <Card.Body className="p-4">
          {/* Display post details */}
          <div className="mb-3">
            <div className="row g-3">
              <div className="col-md-6">
                <div className="d-flex align-items-center text-muted">
                  <span>{post.timestamp && dayjs(post.timestamp).format('YYYY-MM-DD HH:mm')}</span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex align-items-center text-muted">
                  <span>Max Comments: {post.max_comments ?? '∞'}</span>
                </div>
              </div>
            </div>
          </div>
          <hr className="my-3" />
          <div className="fs-6" style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>{post.text}</div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default PostDetails;
