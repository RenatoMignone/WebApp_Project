// -----------------------------------------------------------------------------
// PostList Component
// -----------------------------------------------------------------------------
// This component displays a list of posts. It allows users to select a post to
// view its details and comments. Posts are sorted by timestamp in descending order.
// -----------------------------------------------------------------------------

import React from 'react';
import dayjs from 'dayjs';
import { ListGroup, Badge } from 'react-bootstrap';

function PostList({ posts, onSelect, selectedPost, user }) {
  // Sort posts by timestamp in descending order
  const sortedPosts = [...posts].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div>
      {/* Header for the posts section */}
      <div className="bg-gradient p-3 rounded-top text-white" style={{ background: 'linear-gradient(90deg, #4f8cff 0%, #4f8cff 100%)' }}>
        <h5 className="mb-0"><i className="bi bi-list"></i> Posts</h5>
      </div>
      <ListGroup variant="flush">
        {sortedPosts.map(post => (
          <ListGroup.Item
            key={post.id}
            // Highlight the selected post
            className={`d-flex justify-content-between align-items-center ${selectedPost && selectedPost.id === post.id ? 'active bg-primary text-white' : ''}`}
            style={{ cursor: 'pointer' }}
            onClick={() => onSelect(post)}
          >
            <div>
              {/* Display post title, author, and comment count */}
              <span className="fw-bold">{post.title}</span>
              <span className="text-muted ms-2">by {post.author}</span>
              <Badge bg="info" className="ms-2 text-dark">
                <i className="bi bi-chat-left-text"></i> {post.comments_count}/{post.max_comments ?? '∞'}
              </Badge>
            </div>
            {/* Display post timestamp */}
            <span className="text-secondary small">{post.timestamp && dayjs(post.timestamp).format('YYYY-MM-DD HH:mm')}</span>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default PostList;
