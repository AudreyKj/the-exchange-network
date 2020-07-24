import React from "react";
import { BrowserRouter, Route, Link, NavLink } from "react-router-dom";
import axios from "./axios";
import ProfilePic from "./profilepic.js";
import Shape from "./shape.js";
import Logo from "./logo.js";
import Profile from "./profile.js";
import Login from "./login.js";
import Exchange from "./exchange.js";
import { Chat } from "./chat.js";
import OtherProfile from "./otherprofile.js";
import FindPeople from "./findpeople.js";
import Friends from "./friends.js";
import { Helmet } from "react-helmet";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      first: null,
      last: null,
      id: null,
      bio: null,
      setbio: null
    };
  }

  componentDidMount() {
    axios
      .get("/user")
      .then(({ data }) => {
        this.setState(data);
      })
      .catch(function(error) {
        console.log("error", error);
      });
  }

  render() {
    if (!this.state.id) {
      return null;
    }
    return (
      <>
        <Helmet>
          <meta property="og:image:width" content="1080" />
          <meta property="og:image:height" content="1080" />
          <meta property="og:image" content="preview.jpg" />
          <meta property="og:image:url" content="preview.jpg" />
        </Helmet>

        <AppBar position="static">
          <Toolbar>
            <Typography
              variant="h6"
              component={Link}
              className="link-header"
              to="/welcome"
            >
              EXCHANGE APP
            </Typography>

            <div className="menu">
              <Button
                component={NavLink}
                to="/chat"
                color="inherit"
                className="link-header"
                activeStyle={{
                  borderBottom: "solid 3px rgba(248, 248, 248, 0.8)"
                }}
              >
                chat
              </Button>
              <Button
                component={NavLink}
                to="/exchange"
                color="inherit"
                className="link-header"
                activeStyle={{
                  borderBottom: "solid 3px rgba(248, 248, 248, 0.8)"
                }}
              >
                exchange
              </Button>
              <Button
                component={NavLink}
                to="/friends"
                color="inherit"
                className="link-header"
                activeStyle={{
                  borderBottom: "solid 3px rgba(248, 248, 248, 0.8)"
                }}
              >
                friends
              </Button>

              <Button
                component={NavLink}
                to="/recentusers"
                color="inherit"
                className="link-header"
                activeStyle={{
                  borderBottom: "solid 3px rgba(248, 248, 248, 0.8)"
                }}
              >
                find people
              </Button>

              <Button
                component={NavLink}
                to="/profile"
                color="inherit"
                className="link-header"
                activeStyle={{
                  borderBottom: "solid 3px rgba(248, 248, 248, 0.8)"
                }}
              >
                PROFILE & SETTINGS
              </Button>
            </div>
          </Toolbar>
        </AppBar>

        <Route
          exact
          path="/"
          render={() => (
            <Profile
              id={this.state.id}
              first={this.state.first}
              last={this.state.last}
              url={this.state.url}
              bio={this.state.bio}
              setBio={newBio =>
                this.setState({
                  bio: newBio
                })
              }
              toggleModal={e => this.toggleModal(e)}
            />
          )}
        />

        <Route
          path="/user/:id"
          render={props => (
            <OtherProfile
              key={props.match.url}
              match={props.match}
              history={props.history}
            />
          )}
        />

        <Route
          path="/recentusers"
          render={props => (
            <FindPeople
              key={props.match.id}
              match={props.match}
              history={props.history}
              id={this.state.id}
            />
          )}
        />

        <Route
          path="/friends"
          render={props => (
            <Friends
              key={props.match.id}
              match={props.match}
              history={props.history}
              id={this.state.id}
            />
          )}
        />

        <Route
          path="/exchange"
          render={props => <Exchange key={props.match.id} />}
        />

        <Route
          path="/profile"
          render={props => (
            <Profile first={this.state.first} last={this.state.last} />
          )}
        />

        <Route path="/chat" render={props => <Chat key={props.match.id} />} />
      </>
    );
  }
}
