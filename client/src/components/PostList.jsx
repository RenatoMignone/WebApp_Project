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
      <div className="p-3 rounded-top text-white shadow-sm" style={{ background: 'linear-gradient(90deg, #1e40af 0%, #3b82f6 100%)' }}>
        <h5 className="mb-0 fw-bold"><i className="bi bi-list-ul me-2"></i> Forum Posts</h5>
      </div>
      <ListGroup variant="flush" className="shadow-sm">
        {sortedPosts.map(post => (
          <ListGroup.Item
            key={post.id}
            // Highlight the selected post
            className={`d-flex justify-content-between align-items-center border-0 ${
              selectedPost && selectedPost.id === post.id 
                ? 'text-white' 
                : 'hover-item'
            }`}
            style={{ 
              cursor: 'pointer',
              background: selectedPost && selectedPost.id === post.id 
                ? 'linear-gradient(90deg, #1e40af 0%, #3b82f6 100%)'
                : '#ffffff',
              transition: 'all 0.3s ease',
              borderLeft: selectedPost && selectedPost.id === post.id ? '4px solid #fbbf24' : '4px solid transparent'
            }}
            onClick={() => onSelect(post)}
            onMouseEnter={(e) => {
              if (selectedPost?.id !== post.id) {
                e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                e.target.style.borderLeft = '4px solid #3b82f6';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedPost?.id !== post.id) {
                e.target.style.background = '#ffffff';
                e.target.style.borderLeft = '4px solid transparent';
              }
            }}
          >
            <div>
              {/* Display post title, author, and comment count */}
              <div className="fw-bold fs-6 mb-1">{post.title}</div>
              <div className={`small ${selectedPost?.id === post.id ? 'text-light' : 'text-muted'}`}>
                <i className="bi bi-person-fill me-1"></i>
                by {post.author}
              </div>
              <Badge 
                bg={selectedPost?.id === post.id ? "warning" : "info"} 
                className={`mt-1 ${selectedPost?.id === post.id ? 'text-dark' : 'text-white'}`}
              >
                <i className="bi bi-chat-left-text me-1"></i>
                {post.comments_count}/{post.max_comments ?? '∞'}
              </Badge>
            </div>
            {/* Display post timestamp */}
            <div className="text-end">
              <span className={`small ${selectedPost?.id === post.id ? 'text-light' : 'text-secondary'}`}>
                {post.timestamp && dayjs(post.timestamp).format('MMM DD')}
                <br />
                {post.timestamp && dayjs(post.timestamp).format('HH:mm')}
              </span>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default PostList;
