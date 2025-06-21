import { useEffect } from 'react';
import dayjs from 'dayjs';
import { ListGroup, Badge } from 'react-bootstrap';
import API from '../API';

function PostList({ posts, setPosts, onSelectPost, selectedPost, user, showMessage }) {

  //-----------------------------------------------------------------------------
  // Load posts on mount
  useEffect(() => {
    const refreshPosts = async () => {
      try {
        const postsData = await API.getPosts();
        setPosts(postsData);
      } catch {
        showMessage('Error loading posts');
      }
    };
    
    refreshPosts();
  }, [setPosts, showMessage]);

  // Sort posts by timestamp in descending order
  const sortedPosts = [...posts].sort((a, b) => b.timestamp - a.timestamp);

  //-----------------------------------------------------------------------------
  // Render the list of posts
  return (
    <div>
      {/* Header for the posts section */}
      <div className="p-3 rounded-top text-white shadow-sm" style={{ position: 'relative', zIndex: 10, background: 'linear-gradient(90deg, #1e40af 0%, #3b82f6 100%)' }}>
        <h5 className="mb-0 fw-bold"><i className="bi bi-list-ul me-2"></i> Forum Posts</h5>
      </div>
      
      {/* Took the ListGroup component of bootstrap to display the list of posts */}
      <ListGroup variant="flush" className="shadow-sm">
        {sortedPosts.map(post => {
          const isSelected = selectedPost && selectedPost.id === post.id;
          return (
            <ListGroup.Item
              key={post.id}
              className="d-flex justify-content-between align-items-center border-0"
              style={{ 
                cursor: 'pointer',
                background: isSelected 
                  ? 'linear-gradient(90deg, #1e40af 0%, #3b82f6 100%)'
                  : '#ffffff',
                color: isSelected ? 'white' : 'inherit'
              }}
              onClick={() => onSelectPost(post)}
            >
            <div>
              {/* Display post title, author, and comment count */}
              <div className="fw-bold fs-6 mb-1">{post.title}</div>
              <div className={`small ${isSelected ? 'text-light' : 'text-muted'}`}>
                <i className="bi bi-person-fill me-1"></i>
                by {post.author}
              </div>

              <Badge 
                bg={isSelected ? "warning" : "info"} 
                className={`mt-1 ${isSelected ? 'text-dark' : 'text-white'}`}
              >
                <i className="bi bi-chat-left-text me-1"></i>
                {post.comments_count}/{post.max_comments ?? '∞'}
              </Badge>
              
            </div>
            {/* Display post timestamp */}
            <div className="text-end">
              <span className={`small ${isSelected ? 'text-light' : 'text-secondary'}`}>
                {post.timestamp && dayjs(post.timestamp).format('MMM DD, YYYY')}
                <br />
                {post.timestamp && dayjs(post.timestamp).format('HH:mm')}
              </span>
            </div>
          </ListGroup.Item>
        )})}
      </ListGroup>
    </div>
  );
}

//-----------------------------------------------------------------------------
export default PostList;
