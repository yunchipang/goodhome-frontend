import React, { useState } from 'react';
import './SignupLogin.css';

const SignupLogin = () => {
    const [isSignIn, setIsSignIn] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSignIn) {
            // Handle sign in
            fetch('/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: username, password: password })
            })
                .then(response => {
                    if (response.ok) {
                        alert('Login successful');
                        localStorage.setItem('username', username);
                        window.location.href = '/homepage'; // Redirect to the homepage
                    } else {
                        alert('Login failed');
                    }
                })
                .catch(error => console.error('Error:', error));
        } else {
            // Handle sign up
            if (password !== repeatPassword) {
                alert('Passwords do not match');
                return;
            }
            fetch('http://localhost:8000/signup/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phone: phone,
                    address: address
                })
            })
                .then(response => {
                    if (response.ok) {
                        alert('Registration successful');
                        window.location.href = '/signuplogin'; // Redirect to the homepage
                    } else {
                        response.json().then(data => {
                            alert('Registration failed: ' + data.error);
                        });
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred. Please try again later.');
                });
        }
    };

    return (
        <div className="login-wrap">
            <div className="login-html">
                <input
                    id="tab-1"
                    type="radio"
                    name="tab"
                    className="sign-in"
                    checked={isSignIn}
                    onChange={() => setIsSignIn(true)}
                />
                <label htmlFor="tab-1" className="tab">
                    Sign In
                </label>
                <input
                    id="tab-2"
                    type="radio"
                    name="tab"
                    className="sign-up"
                    checked={!isSignIn}
                    onChange={() => setIsSignIn(false)}
                />
                <label htmlFor="tab-2" className="tab">
                    Sign Up
                </label>
                <div className="login-form">
                    {isSignIn ? (
                        <div className="sign-in-htm">
                            <form onSubmit={handleSubmit}>
                                <div className="group">
                                    <label htmlFor="username" className="label">
                                        Username
                                    </label>
                                    <input
                                        id="username"
                                        type="text"
                                        className="input"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="group">
                                    <label htmlFor="password" className="label">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        className="input"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="group">
                                    <input type="submit" className="button" value="Sign In" />
                                </div>
                            </form>
                            <div className="hr"></div>
                            <div className="foot-lnk"></div>
                        </div>
                    ) : (
                        <div className="sign-up-htm">
                            <form onSubmit={handleSubmit}>
                                <div className="group">
                                    <label htmlFor="first_name" className="label">
                                        First Name
                                    </label>
                                    <input
                                        id="first_name"
                                        type="text"
                                        className="input"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="group">
                                    <label htmlFor="last_name" className="label">
                                        Last Name
                                    </label>
                                    <input
                                        id="last_name"
                                        type="text"
                                        className="input"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="group">
                                    <label htmlFor="username" className="label">
                                        Username
                                    </label>
                                    <input
                                        id="username"
                                        type="text"
                                        className="input"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="group">
                                    <label htmlFor="password" className="label">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        className="input"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="group">
                                    <label htmlFor="repeat_password" className="label">
                                        Repeat Password
                                    </label>
                                    <input
                                        id="repeat_password"
                                        type="password"
                                        className="input"
                                        value={repeatPassword}
                                        onChange={(e) => setRepeatPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="group">
                                    <label htmlFor="email" className="label">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        className="input"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="group">
                                    <label htmlFor="phone" className="label">
                                        Phone
                                    </label>
                                    <input
                                        id="phone"
                                        type="text"
                                        className="input"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                                <div className="group">
                                    <label htmlFor="address" className="label">
                                        Address
                                    </label>
                                    <input
                                        id="mailing_address"
                                        type="text"
                                        className="input"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </div>
                                <div className="group">
                                    <input type="submit" className="button" value="Sign Up" />
                                </div>
                            </form>
                            <div className="hr"></div>
                            <div className="foot-lnk"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SignupLogin;
