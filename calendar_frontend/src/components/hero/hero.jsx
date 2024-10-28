import React, { useState } from "react";
import "./hero.css";
import avatar from "../../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import AlertBox from "../alertBox/alertBox";

const Hero = ({ events, setEvents }) => {
  const [alertMessage, setAlertMessage] = useState("");

  const showAlert = (message, type) => {
    setAlertMessage({ message, type });
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString("en-GB"),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const truncateTitle = (title, maxLength = 40) => {
    return title.length > maxLength ? `${title.slice(0, maxLength)}...` : title;
  };

  const notifyEvent = async (eventId, startTime, endTime) => {
    const currentTime = new Date();
    const eventStartTime = new Date(startTime);
    const eventEndTime = new Date(endTime);
    
    if (currentTime >= eventEndTime) {
      showAlert("Event has already ended.", "error");
      return;
    } 
    if (currentTime >= eventStartTime) {
      showAlert("Event has already started.", "error");
      return;
    } 
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND}/events/notification/${eventId}`,
        {},
        {
          withCredentials: true,
        }
      );
      if (response.data.notification !== undefined) {
        const updatedEvents = events.map((item) => {
          if (item._id === eventId) {
            return {
              ...item,
              notification: response.data.notification,
            };
          }
          return item; 
        }); 
        setEvents(updatedEvents);
        if(response.data.notification)
        showAlert("Notification Scheduled, You will be notified 5 minutes earlier", "success");
      else showAlert("Notifications have been turned off for this event.", "success");
      } else {
        showAlert(" Server error, please try again after some time", "error");
      }
    } catch (error) {
      showAlert("Error setting notification, try again after some time", "error");
    }
  };

  const sortedEvents = events.sort(
    (a, b) => new Date(a.start) - new Date(b.start)
  );

  return (
    <div className="hero-container">
      <div className="hero-card">
        <div className="hero-header">
          <div className="hero-welcome">
            <h2>Welcome</h2>
          </div>
          <div className="hero-avatar">
            <img src={avatar} alt="avatar" />
          </div>
        </div>

        <div className="hero-events">
          <h3>Upcoming Events</h3>
          {sortedEvents.length === 0 ? (
            <div>No upcoming events</div>
          ) : (
            <table className="event-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {sortedEvents.map((event, index) => {
                  const start = formatDateTime(event.start);
                  const end = formatDateTime(event.end);
                  return (
                    <tr key={index} className="event-row">
                      <td>{truncateTitle(event.title)}</td>
                      <td>{start.date}</td>
                      <td>
                        <span className="mr-8">{`${start.time} - ${end.time}`}</span>
                        <FontAwesomeIcon
                          icon={faBell}
                          className="bell-icon"
                          onClick={() => notifyEvent(event._id, event.start, event.end)}
                          style={{
                            marginLeft: "8px",
                            cursor: "pointer",
                            color: event.notification ? "#e405c5" : "#d3d3d366",
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {alertMessage && (
        <AlertBox
          message={alertMessage.message}
          type={alertMessage.type}
          onClose={() => setAlertMessage("")}
        />
      )}
    </div>
  );
};

export default Hero;