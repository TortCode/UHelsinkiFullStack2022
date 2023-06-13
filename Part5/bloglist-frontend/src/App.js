import { useState, useEffect } from 'react'

import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/Notification'

import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON !== null) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
    }
  }, [])

  useEffect(() => {
    (async () => {
      if (user !== null) {
        window.localStorage.setItem(
          'loggedBlogappUser',
          JSON.stringify(user)
        );
        blogService.setToken(user.token);
        
        // update blogs
        const blogs = await blogService.getAll();
        setBlogs(blogs.filter(blog => blog.user.username === user.username));
      }
    })();
  }, [user])

  const addBlogLocally = (blog) => {
    setBlogs([...blogs, blog]);
  }

  const handleLogout = (event) => {
    event.preventDefault();
    window.localStorage.removeItem('loggedBlogappUser');
    setUser(null);
  }

  if (user === null) {
    return (
      <>
        <Notification message={message} isError={isError} />
        <LoginForm setUser={setUser} setMessage={setMessage} setIsError={setIsError}/>
      </>
    )
  } 

  return (
    <>
      <h2>blogs</h2>
      <Notification message={message} isError={isError} />
      <div>
        {user.name ?? user.username} logged in
        <button type="button" onClick={handleLogout}>logout</button>
      </div>
      <NewBlogForm addBlog={addBlogLocally} setMessage={setMessage} setIsError={setIsError}/>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </>
  )
}

export default App