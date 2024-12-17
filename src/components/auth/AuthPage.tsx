import React, {useState, FormEvent} from 'react';
import './styles/LoginPage.css';
import Cookies from 'js-cookie';
import {apiLogin, apiRegister} from '../../api/api';
import {useNavigate} from 'react-router-dom';

interface LoginResponse {
    token: string;
    role: string;
}

interface FormData {
    username?: string;
    login: string;
    email?: string;
    password: string;
    password_confirmation?: string;
}

const initialFormData: FormData = {
    username: '',
    login: '',
    email: '',
    password: '',
    password_confirmation: ''
}

const AuthPage: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>(initialFormData);

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {id, value} = e.target;
        setFormData({...formData, [id]: value});
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const {login, password} = formData;

        try {
            const response = await fetch(apiLogin, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({login, password}),
            });

            if (!response.ok) {
                throw new Error("Invalid credentials");
            }

            const {token, role}: LoginResponse = await response.json();

            Cookies.set("token", token, {expires: 30});

            navigate("/profile")
            if (role.includes("ROLE_ADMIN")) {
                navigate("/admin");
            } else {
                throw new Error("You do not have admin access.");
            }
        } catch (err: any) {
            setError(err.message || "Login failed");
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Клиентская проверка совпадения паролей
        if (formData.password !== formData.password_confirmation) {
            setError("Please, confirm your password correctly!");
            return;
        }

        try {
            // Убираем password_confirmation из тела запроса
            const {username, login, email, password} = formData;

            const response = await fetch(apiRegister, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    username,
                    login,
                    email,
                    password,
                }),
            });

            if (!response.ok) {
                throw new Error("Registration failed");
            }

            alert("User added successfully.");
            navigate("/successful");
        } catch (err: any) {
            setError(err.message || "Registration failed");
        }
    };


    return (
        <div className='auth-container'>
            <ul className="nav nav-pills nav-justified mb-3" id="ex1" role="tablist">
                <li className="nav-item" role="presentation">
                    <a className="nav-link active" id="tab-login" data-bs-toggle="pill" href="#pills-login" role="tab"
                       aria-controls="pills-login" aria-selected="true">Login</a>
                </li>
                <li className="nav-item" role="presentation">
                    <a className="nav-link" id="tab-register" data-bs-toggle="pill" href="#pills-register" role="tab"
                       aria-controls="pills-register" aria-selected="false">Register</a>
                </li>
            </ul>

            <div className="tab-content auth-form">
                <div className="tab-pane fade show active" id="pills-login" role="tabpanel" aria-labelledby="tab-login">
                    <form className='main-form-container' onSubmit={handleLogin}>

                        {error && <p className="error">{error}</p>}

                        <div data-mdb-input-init className="form-outline mb-4">
                            <label className="form-label" htmlFor="login">Login</label>
                            <input type="text" id="login" className="form-control" required value={formData.login}
                                   onChange={handleChange}/>
                        </div>

                        <div data-mdb-input-init className="form-outline mb-4">
                            <label className="form-label" htmlFor="loginPassword">Password</label>
                            <input type="password" id="password" className="form-control" required
                                   value={formData.password} onChange={handleChange}/>
                        </div>

                        <div className="row mb-4">
                            <div className="col-md-6 d-flex justify-content-center">
                                <div className="form-check mb-3 mb-md-0">
                                    <input className="form-check-input" type="checkbox" value="" id="loginCheck"/>
                                    <label className="form-check-label" htmlFor="loginCheck"> Remember me </label>
                                </div>
                            </div>

                            <div className="col-md-6 d-flex justify-content-center">
                                <a href="#!">Forgot password?</a>
                            </div>
                        </div>

                        <button type="submit" data-mdb-button-init data-mdb-ripple-init
                                className="btn btn-primary btn-block mb-4">Log in
                        </button>

                        <div className="text-center">
                            <p>Not a member? <a href="#!">Register</a></p>
                        </div>
                    </form>
                </div>
                <div className="tab-pane fade" id="pills-register" role="tabpanel" aria-labelledby="tab-register">
                    <form className='main-form-container' onSubmit={handleRegister}>

                        <div data-mdb-input-init className="form-outline mb-4">
                            <label className="form-label" htmlFor="login">Login</label>
                            <input type="text" id="login" name="login" className="form-control" required
                                   value={formData.login} onChange={handleChange}/>
                        </div>

                        <div data-mdb-input-init className="form-outline mb-4">
                            <label className="form-label" htmlFor="registerUsername">Username</label>
                            <input type="text" id="username" name="username" className="form-control" required
                                   value={formData.username} onChange={handleChange}/>
                        </div>
                        <div data-mdb-input-init className="form-outline mb-4">
                            <label className="form-label" htmlFor="registerEmail">Email</label>
                            <input type="email" id="email" name='email' className="form-control" required
                                   value={formData.email} onChange={handleChange}/>
                        </div>

                        <div data-mdb-input-init className="form-outline mb-4">
                            <label className="form-label" htmlFor="registerPassword">Password</label>
                            <input type="password" id="password" name='password' className="form-control" required
                                   value={formData.password} onChange={handleChange}/>
                        </div>

                        <div data-mdb-input-init className="form-outline mb-4">
                            <label className="form-label" htmlFor="registerRepeatPassword">Repeat password</label>
                            <input type="password" id="password_confirmation" name='password_confirmation'
                                   className="form-control" required value={formData.password_confirmation}
                                   onChange={handleChange}/>
                        </div>

                        <div className="form-check d-flex justify-content-center mb-4">
                            <input className="form-check-input me-2" type="checkbox" value="" id="registerCheck"
                                   aria-describedby="registerCheckHelpText"/>
                            <label className="form-check-label" htmlFor="registerCheck">
                                I have read and agree to the terms
                            </label>
                        </div>

                        <button type="submit" data-mdb-button-init data-mdb-ripple-init
                                className="btn btn-primary btn-block mb-3">Sign in
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
