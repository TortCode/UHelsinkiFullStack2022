import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUserStorage } from "../reducers/userReducer";

const Navbar = () => {
  const [isActive, setisActive] = useState(false);

  const dispatch = useDispatch();
  const handleLogout = (event) => {
    event.preventDefault();
    dispatch(clearUserStorage());
  };

  const user = useSelector((state) => state.user);

  return (
    <nav className="navbar is-info">
      <div className="navbar-brand">
        <a className="navbar-item is-size-3">BLOGS APP</a>

        <a className="navbar-burger" onClick={() => setisActive(!isActive)}>
          <span></span>
          <span></span>
          <span></span>
        </a>
      </div>
      <div className={"navbar-menu " + (isActive ? "is-active" : "")}>
        <div className="navbar-start">
          <div className="navbar-item is-size-4">
            <Link to="/">Blogs</Link>
          </div>
          <div className="navbar-item is-size-4">
            <Link to="/users">Users</Link>
          </div>
          {user && (
            <>
              <a className="navbar-item is-size-5">
                {user.name ?? user.username} is logged in{" "}
              </a>
              <div className="navbar-item">
                <a
                  className="button is-danger is-size-5 p-3"
                  onClick={handleLogout}
                >
                  Logout
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
