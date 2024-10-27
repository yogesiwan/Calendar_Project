import React, { useState } from "react";
import axios from "axios";

const Signup = ({ setLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [showMessage, setShowMessage] = useState("");

  const handleSignup = async () => {
    try {
      const response = await axios.post("http://localhost:3000/users/register", { email, password, username });
      
      if (response.data.message) {
        setShowMessage("Signup successful! You can now login.");
        setError("");
      } else {
        setError("Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("An error occurred during signup.");
    }
  };

  return (
    <div className="signup">
      <h2>Signup</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="username"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleSignup}>Signup</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {showMessage && <p style={{ color: 'green' }}>{showMessage}</p>}
    </div>
  );
};

export default Signup;