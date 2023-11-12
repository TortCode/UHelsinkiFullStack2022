import React, { useState } from "react";
import { useDispatch } from "react-redux";
import loginService from "../services/login";
import {
  displayErrorNotification,
  displaySuccessNotification,
} from "../reducers/notificationReducer";
import { setUserStorage } from "../reducers/userReducer";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });

      dispatch(setUserStorage(user));
      setUsername("");
      setPassword("");

      dispatch(
        displaySuccessNotification(`Welcome ${user.name ?? user.username}!`, 5),
      );
      navigate("/");
    } catch (error) {
      dispatch(displayErrorNotification(error.response.data.error, 5));
    }
  };

  return (
    <div>
      <div className="title">Login to BLOGS APP</div>
      <form onSubmit={handleLogin}>
        <div className="field">
          <label htmlFor="username" className="label">
            Username
          </label>
          <div className="control">
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="password" className="label">
            Password
          </label>
          <div className="control">
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
        </div>
        <div className="field">
          <div className="control">
            <button id="login-button" type="submit">
              login
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
