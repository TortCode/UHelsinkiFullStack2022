import React, { useState, useContext } from "react";
import { createBlogRemote } from "../reducers/blogsReducer";
import {
  displayErrorNotification,
  displaySuccessNotification,
} from "../reducers/notificationReducer";
import { useDispatch } from "react-redux";
import ToggleContext from "../ToggleContext";

function NewBlogForm() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const { toggleVisibility } = useContext(ToggleContext);

  const dispatch = useDispatch();

  const createBlog = async (blogData) => {
    try {
      const blog = await dispatch(createBlogRemote(blogData));
      toggleVisibility();
      dispatch(
        displaySuccessNotification(
          `a new blog ${blog.title} by ${blog.author} added`,
          5,
        ),
      );
      return true;
    } catch (error) {
      dispatch(displayErrorNotification(error.response.data.error, 5));
      return false;
    }
  };

  const handleCreateBlog = async (event) => {
    event.preventDefault();

    const success = await createBlog({ title, author, url });
    if (success) {
      setTitle("");
      setAuthor("");
      setUrl("");
    }
  };

  return (
    <>
      <div className="title is-4">Create New Blog</div>
      <form onSubmit={handleCreateBlog} id="new-blog">
        <div className="field">
          <label htmlFor="title" className="label">
            Title
          </label>
          <div className="control">
            <input
              type="text"
              value={title}
              id="title"
              name="title"
              onChange={({ target }) => setTitle(target.value)}
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="author" className="label">
            Author
          </label>
          <div className="control">
            <input
              type="text"
              value={author}
              id="author"
              name="author"
              onChange={({ target }) => setAuthor(target.value)}
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="url" className="label">
            URL
          </label>
          <div className="control">
            <input
              type="text"
              value={url}
              id="url"
              name="url"
              onChange={({ target }) => setUrl(target.value)}
            />
          </div>
        </div>
        <div className="field">
          <div className="control">
            <button className="button" type="submit">
              Create
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

export default NewBlogForm;
