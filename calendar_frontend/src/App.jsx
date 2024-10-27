import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/Home/Home";
import CalendarPage from "./components/calendar";

const App = () => {
  
  const [loggedIn, setLoggedIn] = useState(() => {
    const saved = localStorage.getItem("loggedIn");
    return saved === "true";
  });

  useEffect(() => {
    // Update local storage whenever loggedIn state changes
    localStorage.setItem("loggedIn", loggedIn);
  }, [loggedIn]);

  return (
    <Router>
      <Routes>
        {/* Home Route */}
        <Route
          path="/"
          element={<HomePage loggedIn={loggedIn} setLoggedIn={setLoggedIn} />}
        />
        
        {/* Calendar Route with Redirect */}
        <Route
          path="/calendar"
          element={loggedIn ? <CalendarPage /> : <Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
};

export default App;