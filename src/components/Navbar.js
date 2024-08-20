import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const checkAuthStatus = () => {
            const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
            setIsLoggedIn(loggedIn);
        };

        checkAuthStatus();
        window.addEventListener('storage', checkAuthStatus);

        return () => {
            window.removeEventListener('storage', checkAuthStatus);
        };
    }, []);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    const handleRegister = () => {
        navigate('/register');
    };

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        setIsLoggedIn(false);
        setShowDropdown(false);
        navigate('/');
    };

    const handleCartRedirect = () => {
        if (isLoggedIn) {
            navigate('/cart');
        } else {
            alert("Trebuie să fii logat pentru a accesa cosul de cumparaturi.");
            navigate('/login');
        }
    };

    return (
        <header className="navbar">
            <div className="navbar-left">
                <div className="navbar-brand" onClick={() => navigate('/')}></div>
                <button onClick={() => navigate('/dresses/all')}>DRESSES</button>
                <button onClick={() => navigate('/dresses/EVENING%20DRESSES')}>EVENING DRESSES</button>
                <button onClick={() => navigate('/dresses/DAY%20DRESSES')}>DAY DRESSES</button>
            </div>
            <div className="navbar-icons">
                <a onClick={toggleDropdown} aria-label="Profile">
                    <i className="fas fa-user"></i>
                </a>
                {showDropdown && (
                    <div className={`dropdown-content ${showDropdown ? 'show-dropdown' : ''}`}>
                        {isLoggedIn ? (
                            <button onClick={handleLogout} className="logout-button">Logout</button>
                        ) : (
                            <>
                                <button onClick={handleLoginRedirect} className="login-button">Login</button>
                                <button onClick={handleRegister} className="register-button">Register</button>
                            </>
                        )}
                    </div>
                )}
                <a onClick={handleCartRedirect} aria-label="Cart">
                    <i className="fas fa-shopping-cart"></i>
                </a>
                <a href="#wishlist" aria-label="Wishlist">
                    <i className="fas fa-heart"></i>
                </a>
                <a href="#search" aria-label="Search">
                    <i className="fas fa-search"></i>
                </a>
                <a href="#menu" aria-label="Menu">
                    <i className="fas fa-bars"></i>
                </a>
            </div>
        </header>
    );
};

export default Navbar;
