import { useState, useEffect } from 'react'

import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON !== null) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
    }
  }, [])

  useEffect(() => {
    if (user !== null) {
      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(user)
      );
      blogService.setToken(user.token);
    }
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
      <LoginForm setUser={setUser} />
    )
  } 

  return (
    <div>
      <h2>blogs</h2>
      <div>
        {user.name} logged in
        <button type="button" onClick={handleLogout}>logout</button>
      </div>
      <NewBlogForm addBlog={addBlogLocally} />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App