import React, { useState } from "react";
import "./hero.css"; 
import avatar from "../../assets/logo.png";


const Hero = ({ events }) => {

  const [bellStates, setBellStates] = useState({});

  const toggleBell = (index) => {
    setBellStates((prevStates) => ({
      ...prevStates,
      [index]: !prevStates[index],
    }));
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

  const truncateTitle = (title, maxLength = 20) => {
    return title.length > maxLength ? `${title.slice(0, maxLength)}...` : title;
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
        <td>{`${start.time} - ${end.time}`}</td>
      </tr>
    );
  })}
</tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;