import React, { useState, useEffect } from "react";
import "./calendar.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import Hero from "./hero/hero";
import { useNavigate } from "react-router-dom";
import AlertBox from "./alertBox/alertBox";

const localizer = momentLocalizer(moment);

const MyCalendar = (props) => {
  const navigate = useNavigate();

  const [myEventsList, setMyEventsList] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventStart, setEventStart] = useState(null);
  const [eventEnd, setEventEnd] = useState(null);
  const [eventDescription, setEventDescription] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const showAlert = (message) => {
    setAlertMessage(message);
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND}/events`, {
        withCredentials: true,
      });

      const eventsWithValidDates = response.data.events.map((event) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }));

      setMyEventsList(eventsWithValidDates);
    } catch (error) {
      showAlert("Error adding event.");
    }
  };

  const handleAddEvent = async () => {
    if (!eventStart || !eventTitle || !startTime || !endTime) {
      showAlert("More fields are required.");
      return;
    }
    if (startTime === endTime) {
      showAlert("Start time and end time cannot be the same.");
      return;
    }

    const year = eventStart.getFullYear();
    const month = String(eventStart.getMonth() + 1).padStart(2, "0");
    const day = String(eventStart.getDate()).padStart(2, "0");

    const startDate = new Date(`${year}-${month}-${day}T${startTime}:00`);
    const endDate = new Date(`${year}-${month}-${day}T${endTime}:00`);

    const newEvent = {
      title: eventTitle,
      start: startDate,
      end: endDate,
      description: eventDescription,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND}/events/create`,
        newEvent,
        {
          withCredentials: true,
        }
      );

      const createdEvent = {
        ...response.data.event,
        start: new Date(response.data.event.start),
        end: new Date(response.data.event.end),
      };

      setMyEventsList((prevEvents) => [...prevEvents, createdEvent]);
      setShowPopup(false);
      setEventTitle("");
      setStartTime("09:00");
      setEndTime("10:00");
    } catch (error) {
      console.error("Error adding event:", error);
      showAlert("Error adding event.");
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND}/events/delete/${selectedEvent._id}`,
        {
          withCredentials: true,
        }
      );

      setMyEventsList((prevEvents) =>
        prevEvents.filter((event) => event._id !== selectedEvent._id)
      );

      setShowPopup(false);
      setSelectedEvent(null);
    } catch (error) {
      showAlert("Error deleting event.");
    }
  };

  const handleUpdateEvent = async () => {
    setShowUpdatePopup(true);
    setShowPopup(false);
  };

  const submitUpdatedEvent = async () => {
    if (!eventTitle || !startTime || !endTime) {
      showAlert("More fields are required.");
      return;
    }

    if (startTime === endTime) {
      showAlert("Start time and end time cannot be the same.");
      return;
    }

    const year = eventStart.getFullYear();
    const month = String(eventStart.getMonth() + 1).padStart(2, "0");
    const day = String(eventStart.getDate()).padStart(2, "0");

    const updatedEvent = {
      title: eventTitle,
      start: new Date(`${year}-${month}-${day}T${startTime}:00`),
      end: new Date(`${year}-${month}-${day}T${endTime}:00`),
      description: eventDescription,
    };

    try {
      await axios.put(
       `${import.meta.env.VITE_BACKEND}/events/update/${selectedEvent._id}`,
        updatedEvent,
        {
          withCredentials: true,
        }
      );

      // Update the event in myEventsList
      setMyEventsList((prevEvents) =>
        prevEvents.map((event) =>
          event._id === selectedEvent._id
            ? { ...event, ...updatedEvent }
            : event
        )
      );

      setShowUpdatePopup(false);
      setShowPopup(false);
    } catch (error) {
      showAlert("Error updating event.");
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setEventTitle(event.title);
    setEventDescription(event.description);
    setEventStart(new Date(event.start));
    setStartTime(new Date(event.start).toISOString().slice(11, 16));
    setEndTime(new Date(event.end).toISOString().slice(11, 16));
    setShowPopup(true);
  };

  const handleSelect = ({ start }) => {
    setEventStart(start);
    setEventEnd(start);
    setEventTitle("");
    setEventDescription("");
    setStartTime("09:00");
    setEndTime("10:00");
    setSelectedEvent(null);
    setShowPopup(true);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND}/users/logout`,
      {
        withCredentials: true,
      });
      localStorage.removeItem("loggedIn");
      navigate("/");
    } catch (error) {
      showAlert("Error logging out.");
    }
  };

  return (
    <div className="main-container">
      <div className="calendar-wrapper">
        <Calendar
          localizer={localizer}
          events={myEventsList}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleSelect}
          onSelectEvent={handleEventClick}
        />
        <button
          className="absolute top-5 right-5 btn-custom"
          onClick={handleLogout}
        >
          Logout
        </button>
        {alertMessage && (
          <AlertBox
            message={alertMessage}
            onClose={() => setAlertMessage("")}
          />
        )}
        {showPopup && selectedEvent ? (
          <div className="popup">
            <h2>
              Event Details{" "}
              {eventStart ? ` ${eventStart.toLocaleDateString()}` : ""}
            </h2>
            <p>
              <strong>Title:</strong> {selectedEvent.title}
            </p>
            <p>
              <strong>Description:</strong> {selectedEvent.description}
            </p>
            <p>
              <strong>Start:</strong>{" "}
              {new Date(selectedEvent.start).toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </p>
            <p>
              <strong>End:</strong>{" "}
              {new Date(selectedEvent.end).toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </p>
            <button onClick={handleUpdateEvent}>Update Event</button>
            <button onClick={handleDeleteEvent}>Delete Event</button>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        ) : (
          showPopup && (
            <div className="popup">
              <h2>
                Add Event{" "}
                {eventStart ? `on ${eventStart.toLocaleDateString()}` : ""}
              </h2>
              <input
                type="text"
                placeholder="Event Title"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
              />
              <input
                type="text"
                placeholder="Event Description"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
              />
              <label>
                Start Time:
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </label>
              <label>
                End Time:
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </label>
              <button onClick={handleAddEvent}>Add Event</button>
              <button onClick={() => setShowPopup(false)}>Cancel</button>
            </div>
          )
        )}
      </div>
      {showUpdatePopup && (
        <div className="popup">
          <input
            type="text"
            placeholder="Event Title"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Event Description"
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
          />
          <label>
            Start Time:
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </label>
          <label>
            End Time:
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </label>
          <button onClick={submitUpdatedEvent}>Submit Update</button>
          <button onClick={() => setShowUpdatePopup(false)}>Cancel</button>
        </div>
      )}
      <div className="hero-wrapper">
        <Hero className="hero-comp" events={myEventsList}></Hero>
      </div>
    </div>
  );
};

export default MyCalendar;
