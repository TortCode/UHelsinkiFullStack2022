import React from "react";
import Togglable from "./Togglable";
import NewBlogForm from "./NewBlogForm";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const AllBlogs = () => {
  const blogs = useSelector((state) => state.blogs);

  return (
    <>
      <div className="block box">
        <Togglable buttonLabel="New Blog">
          <NewBlogForm />
        </Togglable>
      </div>
      <div>
        {blogs.map((blog) => (
          <div key={blog.id} className="block box">
            <div className="has-text-link">
              <Link to={`/blogs/${blog.id}`}>{blog.title} </Link>
            </div>
            by {blog.author}
          </div>
        ))}
      </div>
    </>
  );
};

export default AllBlogs;
