import React, { useState, useEffect } from 'react';
import InstagramLoginButton from './components/InstagramLogin/InstagramLogin'; 
import axios from 'axios'; 

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [accessToken, setAccessToken] = useState('');
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  // Function to fetch user's Instagram posts
  const fetchInstagramPosts = () => {
   
    axios.get(`//api`)
      .then((response) => {
        if (response.data && response.data.data.length > 0) {
          const postsData = response.data.data.map((post) => ({
            id: post.id,
            caption: post.caption,
            permalink: post.permalink,
            comments: [], // You'll need to fetch comments separately
          }));
          setPosts(postsData);
        } else {
          toast.error('No posts found.');
        }
      })
      .catch((error) => {
        console.error('Error fetching Instagram posts:', error);
        toast.error('Error fetching Instagram posts.');
      });
  };

  // Function to fetch comments for a specific post
  const fetchInstagramComments = (postId) => {
    //yet to implement 
  };

  // Function to handle selecting a post
  const handlePostSelect = (postId) => {
    const post = posts.find((post) => post.id === postId);
    setSelectedPost(post);
    // Fetch comments for the selected post
    fetchInstagramComments(postId);
  };


  useEffect(() => {
    if (accessToken) {
      fetchInstagramPosts();
    }
  }, [accessToken]);

  return (
    <>
      <ToastContainer />
      <InstagramLoginButton setAccessToken={setAccessToken} />
      {selectedPost && (
        <div className="selected-post">
          <h1 className="post-name">Selected Post: {selectedPost.caption}</h1>
          {/* Display comments for the selected post here */}
        </div>
      )}
    </>
  );
}

export default App;
