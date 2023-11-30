import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [userName, setUserName] = useState('');
  const [message, setMessage] = useState('');
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/posts?search=${search}').then((response) => setPosts(response.data));
  }, [search]);

  const handlePostSubmit = () => {
    axios.post('http://localhost:5000/api/posts', { userName, message })
      .then((response) => {
        setPosts([...posts, response.data]);
        setUserName('');
        setMessage('');
      })
      .catch((error) => {
        console.error('Error submitting post:', error);
      });
  };

  const handleCommentSubmit = (postId) => () => {
    const newComment = { userName, message };
    axios.post(`http://localhost:5000/api/posts/${postId}/comments`, newComment)
      .then((response) => {
        const updatedPosts = posts.map((post) =>
          post._id === postId ? { ...post, comments: response.data.comments } : post
        );
        setPosts(updatedPosts);
        setMessage(''); 
      })
      .catch((error) => {
        console.error('Error submitting comment:', error);
      });
  };

  const handleSearch = () => {
    axios.get(`http://localhost:5000/api/posts?search=${search}`).then((response) => {
      setPosts(response.data);
    });
  };

  return (
    <div>
      <h1>Posts Feed</h1>
      <label>
        Your Name:
        <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
      </label>
      <label>
        Your Message:
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
      </label>
      <button onClick={handlePostSubmit}>Submit Post</button>
      <label>
        Search:
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
      </label>
      <button onClick={handleSearch}>Search</button>
      {posts.length === 0 ? (
        <p>No posts available. Create one!</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post._id}>
              <strong>{post.userName}</strong>: {post.message}
              <ul>
                {post.comments.map((comment, index) => (
                  <li key={index}>
                    <strong>{comment.userName}</strong>: {comment.message}
                  </li>
                ))}
              </ul>
              <label>
                Your Comment:
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={handleCommentSubmit(post._id)}>Submit Comment</button>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;

