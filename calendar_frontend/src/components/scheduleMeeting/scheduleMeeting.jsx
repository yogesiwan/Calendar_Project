import React, { useState } from "react";
import axios from "axios";
import AlertBox from "../alertBox/alertBox";
import "./scheduleMeeting.css";

const UserSearch = ({ setUserEvents }) => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [alert, setAlert] = useState({ message: "", type: "" });

  const fetchSuggestions = async (query) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND}/meetings/users`,
        {
          params: { email: query },
          withCredentials: true,
        }
      );
      setSuggestions(response.data.users || []);
    } catch (err) {
      setSuggestions([]);
      console.error("Error fetching suggestions:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setInput(query);

    if (typingTimeout) clearTimeout(typingTimeout);

    if (!query) {
      setSuggestions([]);
      setError(null);
      return;
    }

    setTypingTimeout(
      setTimeout(() => {
        fetchSuggestions(query);
      }, 300)
    );
  };

  const handleSuggestionClick = (user) => {
    // Check if the user is already added
    const isAlreadyAdded = selectedUsers.some(
      (selectedUser) => selectedUser.email === user.email
    );
  
    if (isAlreadyAdded) {
      setAlert({ message: "User already added.", type: "error" });
      return;
    }
  
    // Add the clicked user to the selectedUsers list
    setSelectedUsers((prev) => [...prev, user]);
    setAlert({ message: "User added successfully.", type: "success" });
    setInput("");
    setSuggestions([]);
  };
  const handleSearch = async () => {
    if (!input) {
      setError("Please enter a search query.");
      return;
    }
  
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND}/meetings/users`,
        {
          params: { email: input },
          withCredentials: true,
        }
      );
  
      const foundUsers = response.data.users || [];
      if (foundUsers.length > 0) {
        setSuggestions(foundUsers); // Display suggestions
      } else {
        setAlert({
          message: "No exact match found. Invite the user manually.",
          type: "error",
        });
      }
    } catch (err) {
      console.error("Error searching for user:", err.message);
      setAlert({
        message: "An error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserRemove = (userId) => {
    setSelectedUsers((prevUsers) =>
      prevUsers.filter((user) => user._id !== userId)
    );
    setAlert({ message: "User removed successfully.", type: "success" });
  };

  const fetchUserEvents = async () => {
    const allUserEvents = [];
    for (const user of selectedUsers) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND}/meetings/${user._id}`,
          { withCredentials: true }
        );
        allUserEvents.push(...(response.data.events || []));
      } catch (err) {
        console.error("Error fetching user events:", err.message);
        setError("Failed to load events. Please try again.");
      }
    }
    setUserEvents(allUserEvents);
  };

  React.useEffect(() => {
    if (selectedUsers.length > 0) fetchUserEvents();
    else setUserEvents([]);
  }, [selectedUsers, setUserEvents]);

  return (
    <div className="user-search">
      <h1 className="font-bold">See Other User's Events</h1>
      <h2>User Search</h2>
      <form className="search-form">
        <div className="input-wrapper">
          <input
            type="search"
            placeholder="Username or Email"
            value={input}
            onChange={handleInputChange}
            aria-label="Search for a user"
          />
          {isLoading && <span className="loading-spinner"></span>}
        </div>
      </form>
      {alert.message && (
        <AlertBox
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ message: "", type: "" })}
        />
      )}
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion._id}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.username} ({suggestion.email})
            </li>
          ))}
        </ul>
      )}
      {selectedUsers.length > 0 && (
        <div className="selected-users">
          <h3>Selected Users:</h3>
          <div className="selected-list">
            {selectedUsers.map((user) => (
              <div key={user._id} className="user-badge">
                <span className="user-name">{user.username[0]}</span>
                <span
                  className="remove-icon"
                  onClick={() => handleUserRemove(user._id)}
                  aria-label="Remove user"
                >
                  &times;
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSearch;
