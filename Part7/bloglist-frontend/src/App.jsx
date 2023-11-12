import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, useMatch, Navigate } from "react-router-dom";

import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import AllUsers from "./components/AllUsers";
import User from "./components/User";
import AllBlogs from "./components/AllBlogs";
import Blog from "./components/Blog";
import Navbar from "./components/Navbar";

import "bulma/css/bulma.min.css";

import { setToken } from "./services/utils";
import usersService from "./services/users";
import { initUserStorage, clearUserStorage } from "./reducers/userReducer";
import { initBlogsRemote } from "./reducers/blogsReducer";

const App = () => {
  const blogs = useSelector((state) => {
    const unsorted = state.blogs;
    return [...unsorted].sort((a, b) => b.likes - a.likes);
  });

  const user = useSelector((state) => state.user);
  const [allUsers, setAllUsers] = useState([]);

  const userMatch = useMatch("/users/:id");
  const selectedUser = userMatch
    ? allUsers.find((user) => user.id === userMatch.params.id)
    : null;

  const blogMatch = useMatch("/blogs/:id");
  const selectedBlog = blogMatch
    ? blogs.find((blog) => blog.id === blogMatch.params.id)
    : null;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initUserStorage());
  }, []);

  useEffect(() => {
    const runEffect = async () => {
      setAllUsers(await usersService.getAll());
    };
    runEffect();
  }, []);

  useEffect(() => {
    (async () => {
      if (user !== null) {
        setToken(user.token);
        // update blogs
        await dispatch(initBlogsRemote());
      }
    })();
  }, [user]);

  if (user === null) {
    return (
      <section className="section has-background-primary-light">
        <Notification />
        <LoginForm />
      </section>
    );
  }

  return (
    <div>
      <Navbar />
      <section className="section">
        <Notification />
        <Routes>
          <Route path="/" element={<Navigate replace to="/blogs" />} />
          <Route path="/blogs" element={<AllBlogs />} />
          <Route
            path="/blogs/:id"
            element={
              selectedBlog ? (
                <Blog blog={selectedBlog} />
              ) : (
                <Navigate replace to={"/"} />
              )
            }
          />
          <Route path="/users" element={<AllUsers users={allUsers} />} />
          <Route
            path="/users/:id"
            element={
              selectedUser ? (
                <User user={selectedUser} />
              ) : (
                <Navigate replace to={"/"} />
              )
            }
          />
        </Routes>
      </section>
    </div>
  );
};

export default App;
