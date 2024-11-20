import React, { useState, useEffect } from "react";
import "./calendar.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import Hero from "./hero/hero";
import { useNavigate } from "react-router-dom";
import AlertBox from "./alertBox/alertBox";
import UserSearch from "./scheduleMeeting/scheduleMeeting";

const localizer = momentLocalizer(moment);

const MyCalendar = (props) => {
  const navigate = useNavigate();

  const [myEventsList, setMyEventsList] = useState([]);
  const [userEventsList, setUserEventsList] = useState([]);
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
  const [userEvents, setUserEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, [userEvents]);

  const showAlert = (message, type) => {
    setAlertMessage({ message, type });
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND}/events`,
        {
          withCredentials: true,
        }
      );

      const eventsWithValidDates = response.data.events.map((event) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }));
      // Merge the user's events with the default events
      const userSpecificEvents = userEvents.map((event) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
        userEvent: true, // Flag to differentiate user events
        // userName: event.user,
      }));

      setMyEventsList(eventsWithValidDates);
      setUserEventsList(userSpecificEvents);
    } catch (error) {
      showAlert(
        "Some error occured, please try again after some time",
        "error"
      );
    }
  };

  const handleAddEvent = async () => {
    if (!eventStart || !eventTitle || !startTime || !endTime) {
      showAlert("More fields are required.", "error");
      return;
    }
    if (startTime === endTime) {
      showAlert("Start time and end time cannot be the same.", "error");
      return;
    }

    const startdate = new Date(
      `${eventStart.getFullYear()}-${String(eventStart.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(eventStart.getDate()).padStart(2, "0")}T${startTime}:00`
    );
    const enddate = new Date(
      `${eventStart.getFullYear()}-${String(eventStart.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(eventStart.getDate()).padStart(2, "0")}T${endTime}:00`
    );
    if (enddate < startdate) {
      showAlert("End time cannot be earlier than start time.", "error");
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
      if (response.data.overlaps) {
        showAlert(
          `Event timing overlapping with event ${response.data.event}`,
          "error"
        );
        return;
      }
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
      showAlert("Event set successfully!", "success");
    } catch (error) {
      // console.error("Error adding event:", error);
      showAlert("Error adding event.", "error");
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
      showAlert("Event deleted successfully!", "success");

      setShowPopup(false);
      setSelectedEvent(null);
    } catch (error) {
      showAlert("Error deleting event.", "error");
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

    const startdate = new Date(
      `${eventStart.getFullYear()}-${String(eventStart.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(eventStart.getDate()).padStart(2, "0")}T${startTime}:00`
    );
    const enddate = new Date(
      `${eventStart.getFullYear()}-${String(eventStart.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(eventStart.getDate()).padStart(2, "0")}T${endTime}:00`
    );

    if (enddate < startdate) {
      showAlert("End time cannot be earlier than start time.", "error");
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
      notification:
        startdate.getTime() === selectedEvent.start.getTime() &&
        enddate.getTime() === selectedEvent.end.getTime()
          ? selectedEvent.notification
          : false,
    };

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND}/events/update/${selectedEvent._id}`,
        updatedEvent,
        {
          withCredentials: true,
        }
      );
      if (response.data.overlaps) {
        showAlert(
          `Event timing overlapping with event ${response.data.event}`,
          "error"
        );
        return;
      }

      setMyEventsList((prevEvents) =>
        prevEvents.map((event) =>
          event._id === selectedEvent._id
            ? { ...event, ...updatedEvent }
            : event
        )
      );

      setShowUpdatePopup(false);
      setShowPopup(false);
      showAlert("Event updated successfully!", "success");
    } catch (error) {
      showAlert("Error updating event.", "error");
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setEventTitle(event.title);
    setEventDescription(event.description);
    setEventStart(new Date(event.start));
    const startHours = new Date(event.start)
      .getHours()
      .toString()
      .padStart(2, "0");
    const startMinutes = new Date(event.start)
      .getMinutes()
      .toString()
      .padStart(2, "0");
    setStartTime(`${startHours}:${startMinutes}`);

    const endHours = new Date(event.end).getHours().toString().padStart(2, "0");
    const endMinutes = new Date(event.end)
      .getMinutes()
      .toString()
      .padStart(2, "0");
    setEndTime(`${endHours}:${endMinutes}`);

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
        }
      );
      localStorage.removeItem("loggedIn");
      navigate("/");
    } catch (error) {
      showAlert("Error logging out.", "error");
    }
  };

  return (
    <div className="main-container">
      <div className="calendar-wrapper">
        <Calendar
          localizer={localizer}
          events={[...myEventsList, ...userEventsList]}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleSelect}
          onSelectEvent={handleEventClick}
          components={{
            event: ({ event }) => (
              <span
                className={`title_icon_other_users ${
                  event.userEvent ? "other_user_event" : ""
                }`}
              >
                <span className="event_title">{event.title}</span>
                {event.userEvent && event.user.username ? (
                  <div className="circle">
                    {event.user.username.charAt(0).toUpperCase()}
                  </div>
                ) : null}
              </span>
            ),
          }}
          eventPropGetter={(event) => {
            if (event.userEvent) {
              return {
                style: {
                  backgroundColor: "lightblue",
                  color: "black",
                },
              };
            }
            return {}; // Default style for other events
          }}
        />
        <button
          className="absolute top-5 right-5 btn-custom"
          onClick={handleLogout}
        >
          Logout
        </button>
        {alertMessage && (
          <AlertBox
            message={alertMessage.message}
            type={alertMessage.type}
            onClose={() => setAlertMessage("")}
          />
        )}
        {showPopup && selectedEvent ? (
          <div className="popup">
            <h2>
              Event Details{" "}
              {eventStart ? ` ${eventStart.toLocaleDateString()}` : ""}
            </h2>
            {selectedEvent.userEvent && (
              <p className="other_users">
                <strong>Owner: </strong>
                {selectedEvent.user.username.split(" ")[0]}
              </p>
            )}
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
            {!selectedEvent.userEvent && (
              <>
                <button onClick={handleUpdateEvent}>Update Event</button>
                <button onClick={handleDeleteEvent}>Delete Event</button>
              </>
            )}
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
        <Hero
          className="hero-comp"
          events={myEventsList}
          setEvents={setMyEventsList}
        ></Hero>
        <UserSearch setUserEvents={setUserEvents}></UserSearch>
      </div>
    </div>
  );
};

export default MyCalendar;
