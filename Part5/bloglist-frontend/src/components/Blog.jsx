import React, { useState } from 'react';
import PropTypes from 'prop-types';

function Blog({
  blog, updateBlog, deleteBlog, showRemove,
}) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const likeBlog = () => {
    updateBlog({
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    });
  };

  const removeBlog = () => {
    // eslint-disable-next-line no-alert
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      return;
    }

    deleteBlog();
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle}>
      <div className="default-blog">
        {blog.title}
        {' '}
        {blog.author}
        <button type="button" onClick={toggleExpanded}>
          {expanded ? 'hide' : 'view'}
        </button>
      </div>
      {expanded && (
        <>
          <div>{blog.url}</div>
          <div>
            likes
            {' '}
            {blog.likes}
            <button className="like-blog-button" type="button" onClick={likeBlog}>like</button>
          </div>
          <div>{blog.user.name}</div>
          {showRemove
          && <button className="remove-blog-button" type="button" onClick={removeBlog}>remove</button>}
        </>
      )}
    </div>
  );
}

Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
  }).isRequired,
  updateBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  showRemove: PropTypes.bool.isRequired,
};

export default Blog;
