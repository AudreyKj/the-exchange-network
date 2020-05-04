import React, { useState } from "react";
import Registration from "./registration";
import Login from "./login";
import Register from "./registration.js";
import Shape from "./shape";
import { Link } from "react-router-dom";
import { HashRouter, Route } from "react-router-dom";

export default function Welcome() {
  const [loginVisible, setloginVisible] = useState();
  const [registerVisible, setregisterVisible] = useState();

  const toggleLogin = () => {
    if (!loginVisible) {
      setloginVisible(true);
    } else {
      setloginVisible(false);
    }
  };

  const toggleRegister = () => {
    if (!registerVisible) {
      setregisterVisible(true);
    } else {
      setregisterVisible(false);
    }
  };

  return (
    <div id="welcome">
      <div className="title-socialnetwork">
        <span className="welcome">THE EXCHANGE NETWORK</span>
        <span className="network-motto">
          EXCHANGE LANGUAGES, SKILLS, OR ACTIVITIES WITH YOUR FRIENDS!
        </span>
        <HashRouter>
          <div className="auth-link-wrapper">
            <a className="auth-link" onClick={toggleLogin}>
              LOGIN
            </a>
            <a className="auth-link" onClick={toggleRegister}>
              REGISTER
            </a>
          </div>

          <Route exact path="/register" component={Registration} />

          <Route exact path="/login" component={Login} />
        </HashRouter>
      </div>

      {loginVisible && <Login toggleLogin={toggleLogin} />}
      {registerVisible && <Register toggleRegister={toggleRegister} />}

      <div className="shape-container">
        <Shape> </Shape>
      </div>
    </div>
  );
}
