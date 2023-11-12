import React from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
  likeBlogRemote,
  deleteBlogRemote,
  addCommentToBlogRemote,
} from "../reducers/blogsReducer";
import {
  displayErrorNotification,
  displaySuccessNotification,
} from "../reducers/notificationReducer";
import { useNavigate } from "react-router-dom";

const Blog = ({ blog }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleLikeBlog = async () => {
    try {
      await dispatch(likeBlogRemote(blog.id));
    } catch (error) {
      dispatch(displayErrorNotification(error.response.data.error, 5));
    }
  };

  const handleRemoveBlog = async () => {
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      return;
    }

    try {
      await dispatch(deleteBlogRemote(blog.id));
      dispatch(displaySuccessNotification("blog deleted", 5));
      navigate("/");
    } catch (error) {
      dispatch(displayErrorNotification(error.response.data.error, 5));
    }
  };

  const handleCommentAdd = async (event) => {
    event.preventDefault();
    const comment = event.target.comment.value;
    try {
      await dispatch(addCommentToBlogRemote(blog.id, comment));
      dispatch(displaySuccessNotification(`comment ${comment} added`, 5));
    } catch (error) {
      dispatch(displayErrorNotification(error.response.data.error, 5));
    }
  };

  const showRemove = blog.user.id === user.id;

  return (
    <div className="box">
      <div className="title">
        {blog.title} by {blog.author}
      </div>
      <div className="block">
        <p className="has-text-link">
          <a href={blog.url}>{blog.url}</a>
        </p>
        <p>added by {blog.user.name ?? blog.user.username}</p>
      </div>
      <div className="block level">
        <div className="level-left">
          <div className="level-item">{blog.likes} likes </div>
          <div className="level-item">
            <button className="button" type="button" onClick={handleLikeBlog}>
              like
            </button>
          </div>
        </div>
      </div>
      {showRemove && (
        <button className="button" type="button" onClick={handleRemoveBlog}>
          remove
        </button>
      )}
      <hr />
      <div className="subtitle has-text-weight-semibold ">Comments</div>
      <form className="block" onSubmit={handleCommentAdd}>
        <div className="field">
          <div className="control">
            <input className="input" type="text" name="comment" size={15} />
          </div>
        </div>
        <div className="field">
          <div className="control">
            <button className="button is-danger" type="submit">
              add comment
            </button>
          </div>
        </div>
      </form>
      <ul className="block">
        {blog.comments.map((comment, i) => (
          <li key={i} className="block has-background-white-bis p-3">
            {comment}
          </li>
        ))}
      </ul>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
    }).isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
  }).isRequired,
};

export default Blog;
