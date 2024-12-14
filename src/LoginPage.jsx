import { useState } from 'react';
import './LoginPage.css';
import api from "./api.js";
import {data} from "react-router-dom";

const LoginPage = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post(`/api/auth/login`, {
                login: login,
                password: password,
            });
            const { token } = response.data;
            localStorage.setItem('token', token);
            window.location.href = '/home';
        } catch (err) {
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
