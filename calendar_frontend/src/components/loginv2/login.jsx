import React, { useState, useEffect } from "react";
import "./login.css";
import logo from "../../assets/logo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../../../firebase";
import { signInWithPopup } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

const LoginPage = ({ setLoggedIn }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [isSignup, setIsSignup] = useState(false);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const idToken = await user.getIdToken();

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND}/users/google-login`,
        { idToken },
        { withCredentials: true }
      );

      if (response.data.message === "Logged in Successfully") {
        setLoggedIn(true);
        navigate("/calendar");
      } else {
        setError(response.data.message || "Login failed.");
        setSuccess("");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError("An error occurred during Google sign-in.");
      setSuccess("");
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND}/users/login`,
        { email, password },
        { withCredentials: true }
      );

      if (response.data.message === "Logged in Successfully") {
        setLoggedIn(true);
        setSuccess(response.data.message);
        setError("");
        navigate("/calendar");
      } else {
        setError(
          response.data.message ||
            "Login failed. Please check your credentials."
        );
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
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND}/users/register`,
        { email, password, username }
      );

      if (response.data.message) {
        setSuccess(response.data.message);
        setError("");
        setIsSignup(false);
      } else {
        setError(response.data.message || "Signup failed. Please try again.");
        setSuccess("");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("An error occurred during signup.");
      setSuccess("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignup) {
      handleSignup();
    } else {
      handleLogin();
    }
  };

  const handleRememberMeClick = () => {
    setRememberMe(!rememberMe);
    if (!rememberMe) {
      setEmail("yogesiwan@gmail.com");
      setPassword("123456");
    } else {
      setEmail("");
      setPassword("");
    }
  };
  const handleToggleForm = () => {
    setError("");
    setSuccess("");
    setIsSignup(!isSignup);
  };

  return (
    <div className="login-card-container">
      <div className="login-card">
        <div className="login-card-logo">
          <img src={logo} alt="logo" />
        </div>
        <div className="login-card-header">
          <h1>{isSignup ? "Sign Up" : "Sign In"}</h1>
          <div>
            {isSignup
              ? "Please sign up to create an account"
              : "Please log in to use the calendar"}
          </div>
        </div>

        <div className="message-container">
          <div className="fixed-message-container">
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
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

          {/* {!isSignup && (
            <div className="form-item-other ml-4">
              <div className="checkbox">
                <input
                  type="checkbox"
                  id="rememberMeCheckbox"
                  checked={rememberMe}
                  onChange={handleRememberMeClick}
                />
                <label htmlFor="rememberMeCheckbox">
                  Use Dummy Credentials
                </label>
              </div>
            </div>
          )} */}

          <button type="submit">{isSignup ? "Sign Up" : "Sign In"}</button>
          <div className="google-signin">
            <span>or</span>
            <span className="ml-9 something">
              continue with 
              <button
                onClick={handleGoogleSignIn}
                className="google-signin-button"
              >
                <FontAwesomeIcon icon={faGoogle} className="google-icon" />
              </button>
              </span>
          </div>
        </form>

        <div className="login-card-footer">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <a href="#" onClick={handleToggleForm}>
                Sign in here.
              </a>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <a href="#" onClick={handleToggleForm}>
                Create one now.
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
