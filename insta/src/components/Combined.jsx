import React, { useState, useEffect } from 'react';
import './InstagramLogin.css'; // Assuming you have a CSS file for styling
import PageConversations from './PageConversations/PageConversations';
import Loader from '../Loader/Loader'; // Assuming you have a Loader component

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function InstagramLoginButton() {
    const [pageAccessTokens, setPageAccessTokens] = useState([]);
    const [posts, setPosts] = useState([]);
    const [replyInputs, setReplyInputs] = useState({});
    const [pageIds, setPageIds] = useState([]);
    const [accessTokens, setAccessTokens] = useState([]);
    const [loading, setLoading] = useState(false);
    const [commentBatchSize, setCommentBatchSize] = useState(5);
    const [commentIndex, setCommentIndex] = useState(commentBatchSize);
    const [selectedPost, setSelectedPost] = useState(null);
    const [selectedPage, setSelectedPage] = useState('');

    const handleFacebookLogin = () => {
        setLoading(true);
        window.FB.login(
            (response) => {
                if (response.authResponse) {
                    const userAccessToken = response.authResponse.accessToken;
                    const userID = response.authResponse.userID;
                    console.log('User access token:', userAccessToken);
                    console.log('User ID:', userID);
                    fetchPageAccessTokens(userAccessToken, userID);
                    setLoading(false);
                    toast.success('Login Successful!!');
                } else {
                    setLoading(false);
                    console.log('User cancelled login or did not fully authorize.');
                }
            },
            { scope: 'email' }
        );
    };

    const fetchPageAccessTokens = (userAccessToken, userID) => {
        window.FB.api(`/${userID}/accounts`, 'GET', { access_token: userAccessToken }, (response) => {
            if (response.data && response.data.length > 0) {
                const pageAccessTokens = response.data.map((page) => ({
                    id: page.id,
                    name: page.name,
                    accessToken: page.access_token,
                }));
                console.log('Page access tokens:', pageAccessTokens);
                setPageAccessTokens(pageAccessTokens);
                const ids = pageAccessTokens.map((page) => page.id);
                const tokens = pageAccessTokens.map((page) => page.accessToken);
                setPageIds(ids);
                setAccessTokens(tokens);
                setSelectedPage(ids[0]);
                fetchPostsAndComments(pageAccessTokens);
            } else {
                console.log('No pages found for the user.');
            }
        });
    };

    const fetchPostsAndComments = (pageAccessTokens) => {
        pageAccessTokens.forEach((page) => {
            window.FB.api(`/${page.id}/posts`, 'GET', { access_token: page.accessToken }, (response) => {
                if (response.data && response.data.length > 0) {
                    const posts = response.data.map((post) => ({
                        id: post.id,
                        name: post.message,
                        accessToken: page.accessToken,
                        comments: [],
                    }));
                    console.log('Posts:', posts);
                    setPosts((prevPosts) => [...prevPosts, ...posts]);
                    fetchComments(posts);
                    toast.success('Posts fetched!!');
                } else {
                    toast.error('No posts found for the page.');
                }
            });
        });
    };

    const fetchComments = (posts) => {
        posts.forEach((post) => {
            window.FB.api(
                `/${post.id}/comments`,
                'GET',
                { access_token: post.accessToken },
                (response) => {
                    if (response.data && response.data.length > 0) {
                        const comments = response.data.map((comment) => ({
                            id: comment.id,
                            message: comment.message,
                            created_time: comment.created_time,
                            name: comment.from.name
                        }));

                        // Sort comments by created_time in descending order
                        const sortedComments = comments.sort((a, b) => new Date(b.created_time) - new Date(a.created_time));

                        console.log('Comments:', sortedComments);
                        setPosts((prevPosts) => {
                            return prevPosts.map((prevPost) => {
                                if (prevPost.id === post.id) {
                                    return { ...prevPost, comments: [...sortedComments] };
                                }
                                return prevPost;
                            });
                        });
                        toast.success('Comments fetched!!');
                    } else {
                        console.log('No comments found for the post.');
                    }
                }
            );
        });
    };

    const handleReply = (postId, commentId, accessToken) => {
        setLoading(true);
        const replyMessage = replyInputs[commentId];
        if (replyMessage.trim() !== '') {
            window.FB.api(`/${commentId}/comments`, 'POST', { access_token: accessToken, message: replyMessage }, (response) => {
                if (response && !response.error) {
                    console.log('Reply posted successfully!');
                    setReplyInputs((prevInputs) => {
                        const newInputs = { ...prevInputs };
                        delete newInputs[commentId];
                        return newInputs;
                    });
                    refreshComments(postId, accessToken);
                    setLoading(false);
                    toast.success('Reply sent successfully');
                } else {
                    setLoading(false);
                    toast.error(`Error posting reply: ${response.error}`);
                }
            });
        } else {
            console.log('Reply message is empty.');
        }
    };

    const refreshComments = (postId, accessToken) => {
        window.FB.api(`/${postId}/comments`, 'GET', { access_token: accessToken }, (response) => {
            if (response.data && response.data.length > 0) {
                const comments = response.data.map((comment) => ({
                    id: comment.id,
                    message: comment.message,
                }));
                setPosts((prevPosts) => {
                    return prevPosts.map((prevPost) => {
                        if (prevPost.id === postId) {
                            return { ...prevPost, comments: comments };
                        }
                        return prevPost;
                    });
                });
            } else {
                console.log('No comments found for the post.');
            }
        });
    };

    const handleInputChange = (commentId, event) => {
        const { value } = event.target;
        setReplyInputs((prevInputs) => ({
            ...prevInputs,
            [commentId]: value,
        }));
    };


    const handleLoadMoreComments = (postId, accessToken) => {
        setCommentIndex((prevIndex) => prevIndex + commentBatchSize);
    };

    const handlePostSelect = (postId) => {
        const post = posts.find((post) => post.id === postId && post.accessToken === selectedPage);
        setSelectedPost(post);
    };

    useEffect(() => {
        if (window.FB) {
            window.FB.XFBML.parse();
        }
    }, []);

    return (
        <>
            <div className="container">
                {loading && <Loader />}
                <button className="login-button" onClick={handleFacebookLogin}>
                    Login with Facebook
                </button>
                {
                    posts.length > 0 && (
                        <div className='post-dropdown'>
                            <h3 className='
