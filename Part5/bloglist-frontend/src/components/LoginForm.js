import { useState } from 'react';
import loginService from '../services/login';

const LoginForm = ({ setUser, setMessage, setIsError }) => {
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
  }

  return (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            name="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            name="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm;