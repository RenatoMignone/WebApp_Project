import React from 'react';
import dayjs from 'dayjs';

function PostList({ posts, onSelect, selectedPost, user }) {
  const sortedPosts = [...posts].sort((a, b) => b.timestamp - a.timestamp); // Sort by timestamp descending
  return (
    <div>
      <div className="bg-gradient p-3 rounded-top" style={{ background: 'linear-gradient(90deg, #4f8cff 0%, #4f8cff 100%)', color: '#fff' }}>
        <h5 className="mb-0"><i className="bi bi-list"></i> Posts</h5>
      </div>
      <ul className="list-group list-group-flush">
        {sortedPosts.map(post => (
          <li
            key={post.id}
            className={`list-group-item d-flex justify-content-between align-items-center ${selectedPost && selectedPost.id === post.id ? 'active bg-primary text-white' : ''}`}
            style={{ cursor: 'pointer', borderBottom: '1px solid #e3e3e3' }}
            onClick={() => onSelect(post)}
          >
            <div>
              <span className="fw-bold">{post.title}</span>
              <span className="text-muted ms-2">by {post.author}</span>
              <span className="ms-2 badge bg-info text-dark">
                <i className="bi bi-chat-left-text"></i> {post.comments_count}/{post.max_comments ?? '∞'}
              </span>
            </div>
            <span className="text-secondary small">{post.timestamp && dayjs(post.timestamp).format('YYYY-MM-DD HH:mm')}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostList;
