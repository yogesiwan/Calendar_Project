import React from "react";
import MiniCalendar from "../../components/miniCalendar/miniCalendar";
import Login from "../../components/loginv2/login";
import "./Home.css";
import { TypeAnimation } from "react-type-animation";

const HomePage = ({ loggedIn, setLoggedIn }) => {

  
  return (
    <div
      className="gap-10 home-container"
      style={{ display: "flex", alignItems: "center", position: "relative" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MiniCalendar />
      </div>

      <div className="typing">
        {" "}
       
        <TypeAnimation
          sequence={[
            "Welcome",
            1500,
            "A calendar to let you \n Add new events",
            500,
            "A calendar to let you \n Update existing events",
            300,
            "A calendar to let you \n Set reminder for what matters",
            300,
            "A calendar to let you \n Stay on top of all your plans",
            300,
            "A calendar for \n just everything",
          ]}
          wrapper="span"
          cursor={true}
          style={{
            fontSize: "1em",
            color: "rgb(254 246 255 / 51%)",
            display: "inline-block",
            whiteSpace: "pre-wrap",
          }}
        />
      </div>

      <Login setLoggedIn={setLoggedIn} />
    </div>
  );
};

export default HomePage;
