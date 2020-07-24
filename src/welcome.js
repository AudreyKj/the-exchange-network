import React, { useState } from "react";
import Registration from "./registration";
import Login from "./login";
import Register from "./registration.js";
import Shape from "./shape";
import { Link, NavLink } from "react-router-dom";
import { HashRouter, Route } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

export default function Welcome() {
  const [shapeVisible, setShapeVisible] = useState(true);

  return (
    <div id="welcome">
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            className="link-header"
            to="/welcome"
            onClick={() => setShapeVisible(true)}
          >
            EXCHANGE LANGUAGES OR SKILLS WITH YOUR FRIENDS
          </Typography>

          <div className="menu">
            <Button
              component={NavLink}
              to="/login"
              color="inherit"
              className="link-header"
              onClick={() => setShapeVisible(false)}
              activeStyle={{
                borderBottom: "solid 3px rgba(248, 248, 248, 0.8)"
              }}
            >
              Login
            </Button>
            <Button
              component={NavLink}
              to="/register"
              color="inherit"
              className="link-header"
              onClick={() => setShapeVisible(false)}
              activeStyle={{
                borderBottom: "solid 3px rgba(248, 248, 248, 0.8)"
              }}
            >
              Register
            </Button>
          </div>
        </Toolbar>
      </AppBar>

      <Route exact path="/register" component={Registration} />

      <Route exact path="/login" component={Login} />

      {shapeVisible && (
        <div className="shape-container">
          <Shape> </Shape>
        </div>
      )}

      <footer>
        EXCHANGE NETWORK © 2020 - see on&nbsp;
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/AudreyKj/the-exchange-network-app"
        >
          GitHub
        </a>
      </footer>
    </div>
  );
}
