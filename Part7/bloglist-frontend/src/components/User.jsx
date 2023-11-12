import React from "react";
import { Link } from "react-router-dom";

const User = ({ user }) => {
  return (
    <div className="box">
      <div className="title">{user.name ?? user.username}</div>
      <hr />
      <div className="block is-size-4">Added Blogs</div>
      <ul>
        {user.blogs.map((blog, i) => (
          <li
            key={blog.id}
            className="block has-background-info-light has-text-link p-3"
          >
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default User;
