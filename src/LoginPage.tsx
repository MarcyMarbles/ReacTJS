import React, { useState, FormEvent } from 'react';
import './LoginPage.css';
import api from './api';

interface LoginResponse {
  token: string;
  role: string;
}

const LoginPage: React.FC = () => {
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await api.post<LoginResponse>(`/api/auth/login`, {
        login,
        password,
      });
      const { token, role } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      window.location.href = '/home';
    } catch (err: any) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Invalid login credentials');
      } else {
        setError('Something went wrong. Please try again later.');
      }
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
