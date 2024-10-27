import React, { useState, useEffect } from 'react';
import './login.css'; 
import logo from '../../assets/logo.png'; 
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ setLoggedIn }) => {
    const navigate = useNavigate(); 

    // States for login and signup forms
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');  // Only for signup
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");  // For displaying success messages
    const [rememberMe, setRememberMe] = useState(false); // Use for dummy checkbox

    // Toggle between login and signup forms
    const [isSignup, setIsSignup] = useState(false);

    // Automatically clear error message after 2 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError("");
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    // Handle login logic
    const handleLogin = async () => {
        try {
            const response = await axios.post(
              `${import.meta.env.VITE_BACKEND}/users/login`,
                { email, password },
                { withCredentials: true }
            );
           

            if (response.data.message === "Logged in Successfully") {
                setLoggedIn(true);
                setSuccess(response.data.message);  // Set success message from server
                setError("");
                navigate('/calendar');
            } else {
                setError(response.data.message || "Login failed. Please check your credentials.");
                setSuccess(""); 
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("An error occurred while logging in.");
            setSuccess(""); 
        }
    };

    const handleSignup = async () => {
        try {
            const response = await axios.post(  `${import.meta.env.VITE_BACKEND}/users/register`,
                { email, password, username });
            
            if (response.data.message) {
                setSuccess(response.data.message); 
                setError("");  
                setIsSignup(false);
            } else {
                setError(response.data.message || "Signup failed. Please try again.");  // Set error message from server
                setSuccess("");  // Clear success message
            }
        } catch (error) {
            console.error("Signup error:", error);
            setError("An error occurred during signup.");  // Generic error message for unexpected issues
            setSuccess("");
        }
    };

    // Form submission handler
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSignup) {
            handleSignup();  // Call signup logic if in signup mode
        } else {
            handleLogin();  // Call login logic if in login mode
        }
    };

    // Handle dummy checkbox click
    const handleRememberMeClick = () => {
        setRememberMe(!rememberMe);
        if (!rememberMe) {
            // Autofill with dummy values
            setEmail("tonystark@gmail.com");
            setPassword("calendar app");
        } else {
            // Clear values if unchecked
            setEmail('');
            setPassword('');
        }
    };

    // Clear error and success messages when switching between login/signup
    const handleToggleForm = () => {
        setError('');
        setSuccess('');
        setIsSignup(!isSignup);
    };

    return (
        <div className="login-card-container">
            <div className="login-card">
                <div className="login-card-logo">
                    <img src={logo} alt="logo" />
                </div>
                <div className="login-card-header">
                    <h1>{isSignup ? 'Sign Up' : 'Sign In'}</h1>
                    <div>{isSignup ? 'Please sign up to create an account' : 'Please log in to use the calendar'}</div>
                </div>

                {/* Flash messages */}
                <div className="message-container">
                    <div className="fixed-message-container">
                        {error && <div className="error-message">{error}</div>}   {/* Display error messages */}
                        {success && <div className="success-message">{success}</div>} {/* Display success messages */}
                    </div>
                </div>

                <form className="login-card-form" onSubmit={handleSubmit}>
                    {isSignup && (
                        <div className="form-item">
                            <input
                                type="text"
                                placeholder="Enter Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div className="form-item">
                        <input
                            type="email"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-item">
                        <input
                            type="password"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Dummy Remember me checkbox */}
                    {!isSignup && (
                        <div className="form-item-other ml-4">
                            <div className="checkbox">
                                <input
                                    type="checkbox"
                                    id="rememberMeCheckbox"
                                    checked={rememberMe}
                                    onChange={handleRememberMeClick}
                                />
                                <label htmlFor="rememberMeCheckbox">Use Dummy Credentials</label>
                            </div>
                        </div>
                    )}

                    <button type="submit">{isSignup ? 'Sign Up' : 'Sign In'}</button>
                </form>

                {/* Toggle between signup and login */}
                <div className="login-card-footer">
                    {isSignup ? (
                        <>
                            Already have an account? <a href="#" onClick={handleToggleForm}>Sign in here.</a>
                        </>
                    ) : (
                        <>
                            Don't have an account? <a href="#" onClick={handleToggleForm}>Create one now.</a>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;