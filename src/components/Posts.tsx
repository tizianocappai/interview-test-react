import { useState, useEffect } from 'react';
import PostForm from './PostForm';
import './Posts.css';

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
  isNew?: boolean;
}

function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleAddPost = (newPost: Post) => {
    const postWithNewFlag = { ...newPost, isNew: true };
    setPosts((prevPosts) => [postWithNewFlag, ...prevPosts]);

    // Remove the "new" flag after animation
    setTimeout(() => {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === newPost.id ? { ...post, isNew: false } : post
        )
      );
    }, 2000);
  };

  if (loading) {
    return (
      <div className="posts-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="posts-container">
        <div className="error-card">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="posts-container">
      <header className="posts-header">
        <h1>Posts</h1>
        <p className="subtitle">{posts.length} posts available</p>
      </header>

      <PostForm onSubmit={handleAddPost} />

      <div className="posts-grid">
        {posts.map((post) => (
          <article key={post.id} className={`post-card ${post.isNew ? 'new-post' : ''}`}>
            <div className="post-header">
              <span className="post-id">#{post.id}</span>
              <span className="user-badge">User {post.userId}</span>
              {post.isNew && <span className="new-badge">New</span>}
            </div>
            <h2 className="post-title">{post.title}</h2>
            <p className="post-body">{post.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Posts;
