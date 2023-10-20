import React, { useState, useEffect, useRef } from 'react';

import Blog from './components/Blog';
import LoginForm from './components/LoginForm';
import NewBlogForm from './components/NewBlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';

import blogService from './services/blogs';

function App() {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const blogFormRef = useRef();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON !== null) {
      const savedUser = JSON.parse(loggedUserJSON);
      setUser(savedUser);
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (user !== null) {
        window.localStorage.setItem(
          'loggedBlogappUser',
          JSON.stringify(user),
        );
        blogService.setToken(user.token);
        // update blogs
        const curBlogs = await blogService.getAll();
        setBlogs(curBlogs);
      }
    })();
  }, [user]);

  const createBlog = async (blogData) => {
    try {
      const blog = await blogService.create(blogData);
      setBlogs([...blogs, blog]);
      blogFormRef.current.toggleVisibility();
      setIsError(false);
      setMessage(`a new blog ${blog.title} by ${blog.author} added`);
      setTimeout(() => {
        setMessage(null);
      }, 5000);
      return true;
    } catch (error) {
      setIsError(true);
      setMessage(error.response.data.error);
      setTimeout(() => {
        setMessage(null);
      }, 5000);
      return false;
    }
  };

  const updateBlog = async (blogId, newData) => {
    try {
      const blog = await blogService.update(blogId, newData);
      setBlogs(blogs.map((b) => (b.id === blog.id ? blog : b)));
      return true;
    } catch (error) {
      setIsError(true);
      setMessage(error.response.data.error);
      setTimeout(() => {
        setMessage(null);
      }, 5000);
      return false;
    }
  };

  const deleteBlog = async (blogId) => {
    try {
      await blogService.destroy(blogId);
      setBlogs(blogs.filter((b) => b.id !== blogId));
      setIsError(false);
      setMessage('blog deleted');
      setTimeout(() => {
        setMessage(null);
      }, 5000);
      return true;
    } catch (error) {
      setIsError(true);
      setMessage(error.response.data.error);
      setTimeout(() => {
        setMessage(null);
      }, 5000);
      return false;
    }
  };

  const handleLogout = (event) => {
    event.preventDefault();
    window.localStorage.removeItem('loggedBlogappUser');
    setUser(null);
  };

  blogs.sort((a, b) => b.likes - a.likes);

  if (user === null) {
    return (
      <>
        <Notification message={message} isError={isError} />
        <LoginForm setUser={setUser} setMessage={setMessage} setIsError={setIsError} />
      </>
    );
  }

  return (
    <>
      <h2>blogs</h2>
      <Notification message={message} isError={isError} />
      <div>
        {user.name ?? user.username}
        logged in
        <button type="button" onClick={handleLogout}>logout</button>
      </div>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <NewBlogForm createBlog={createBlog} />
      </Togglable>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={(data) => updateBlog(blog.id, data)}
          deleteBlog={() => deleteBlog(blog.id)}
          showRemove={blog.user.username === user.username}
        />
      ))}
    </>
  );
}

export default App;
