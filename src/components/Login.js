import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

function Login() {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.body.classList.add('login-page');
        return () => {
            document.body.classList.remove('login-page');
        };
    }, []);

    const handleInputChange = (e) => {
        setCredentials({...credentials, [e.target.name]: e.target.value});
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed.');
            }

            // Stocare cartId și isLoggedIn în localStorage
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('cartId', data.cartId); // Presupunând că backend-ul returnează un cartId

            console.log('Login successful:', data);
            setSuccess(data.message);
            setError(null);
            navigate('/');
        } catch (err) {
            setError(err.message);
            setSuccess(null);
        }
    };

    const handleRegisterRedirect = () => {
        navigate('/register');
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <form onSubmit={handleLogin}>
                    <h2>Login</h2>
                    {error && <p className="error">{error}</p>}
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={credentials.email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            value={credentials.password}
                            onChange={handleInputChange}
                        />
                    </div>
                    <button type="submit">Login</button>
                    <div className="register-link">
                        <p>You don't have an account? <button onClick={handleRegisterRedirect}>Sign up</button></p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
