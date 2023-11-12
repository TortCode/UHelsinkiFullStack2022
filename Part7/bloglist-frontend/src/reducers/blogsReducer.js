import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";

const blogsSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    appendBlog(state, action) {
      return [...state, action.payload];
    },
    likeBlog(state, action) {
      const id = action.payload;
      const blog = state.find((blog) => blog.id === id);
      blog.likes++;
    },
    deleteBlog(state, action) {
      const id = action.payload;
      const index = state.findIndex((blog) => blog.id === id);
      state.splice(index, 1);
    },
    addCommentToBlog(state, action) {
      const { id, comment } = action.payload;
      const blog = state.find((blog) => blog.id === id);
      blog.comments.push(comment);
    },
  },
});

export const initBlogsRemote = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const createBlogRemote = (blog) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(blog);
    dispatch(appendBlog(newBlog));
    return newBlog;
  };
};

export const likeBlogRemote = (id) => {
  return async (dispatch, getState) => {
    const blog = getState().blogs.find((blog) => blog.id === id);
    const data = {
      ...blog,
      likes: blog.likes + 1,
    };
    const updatedBlog = await blogService.update(id, data);
    dispatch(likeBlog(id));
    return updatedBlog;
  };
};

export const deleteBlogRemote = (id) => {
  return async (dispatch) => {
    await blogService.destroy(id);
    dispatch(deleteBlog(id));
  };
};

export const addCommentToBlogRemote = (id, comment) => {
  return async (dispatch) => {
    await blogService.postComment(id, comment);
    dispatch(addCommentToBlog({ id, comment }));
  };
};

export const { setBlogs, appendBlog, likeBlog, deleteBlog, addCommentToBlog } =
  blogsSlice.actions;

export default blogsSlice.reducer;
