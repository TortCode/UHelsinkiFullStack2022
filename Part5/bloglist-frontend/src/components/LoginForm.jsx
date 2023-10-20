import React, { useState } from 'react';
import PropTypes from 'prop-types';
import loginService from '../services/login';

function LoginForm({ setUser, setMessage, setIsError }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });

      setUser(user);
      setUsername('');
      setPassword('');

      setIsError(false);
      setMessage(`Welcome ${user.name ?? user.username}!`);
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    } catch (error) {
      setIsError(true);
      setMessage(error.response.data.error);
      setTimeout(() => {
        setMessage(null);
        setIsError(false);
      }, 5000);
    }
  };

  return (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id="login-button" type="submit">login</button>
      </form>
    </div>
  );
}

LoginForm.propTypes = {
  setUser: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  setIsError: PropTypes.func.isRequired,
};

export default LoginForm;
