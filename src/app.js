import React from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import axios from "./axios";
import ProfilePic from "./profilepic.js";
import Shape from "./shape.js";
import Logo from "./logo.js";
import Uploader from "./uploader.js";
import Profile from "./profile.js";
import Login from "./login.js";
import Exchange from "./exchange.js";
import { Chat } from "./chat.js";
import OtherProfile from "./otherprofile.js";
import FindPeople from "./findpeople.js";
import Friends from "./friends.js";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploaderVisible: false,
      first: null,
      last: null,
      url: null,
      id: null,
      bio: null,
      setbio: null,
      deleteAccountCheckVisible: false
    };

    //this.toggleModal = this.toggleModal.bind(this);
    this.deleteaccountcheck = this.deleteaccountcheck.bind(this);
    this.closedeleteAccountCheck = this.closedeleteAccountCheck.bind(this);
  }

  //modal for uploading a new profile pic
  // toggleModal() {
  //     if (!this.state.uploaderVisible) {
  //         this.setState({ uploaderVisible: true });
  //     } else {
  //         this.setState({ uploaderVisible: false });
  //     }
  // }

  componentDidMount() {
    axios
      .get("/user")
      .then(({ data }) => {
        this.setState(data);
      })
      .catch(function(error) {
        console.log("error in componentDidMount App", error);
      });
  }

  logout() {
    axios
      .get("/logout")
      .then(({ data }) => {
        location.replace("/welcome");
      })
      .catch(function(error) {
        console.log("error in /logout", error);
      });
  }

  deleteaccountcheck() {
    this.setState({ deleteAccountCheckVisible: true });
  }

  closedeleteAccountCheck() {
    document.querySelector("div.modal-background").style.animation =
      "fadeOff 0.3s";
    setTimeout(() => {
      this.setState({ deleteAccountCheckVisible: false });
    }, 300);
  }

  deleteaccount() {
    axios
      .get("/deleteaccount")
      .then(({ data }) => {
        location.replace("/welcome");
      })
      .catch(function(error) {
        console.log("error in /deleteaccount", error);
      });
  }

  render() {
    if (!this.state.id) {
      return null;
    }
    return (
      <>
        <div className="header">
          <Logo></Logo>
        </div>

        <BrowserRouter>
          <div className="profile-section">
            <ProfilePic
              first={this.state.first}
              last={this.state.last}
              url={this.state.url}
              toggleModal={e => this.toggleModal(e)}
            />
            <Link className="profile-section-link" to="/">
              EDIT BIO
            </Link>

            <span
              className="profile-section-link"
              onClick={this.deleteaccountcheck}
            >
              DELETE ACCOUT
            </span>

            <span className="profile-section-link" onClick={this.logout}>
              LOGOUT
            </span>
          </div>
          {this.state.deleteAccountCheckVisible && (
            <div className="modal-background">
              <div className="deleteaccount-confirm">
                <div
                  className="close-info"
                  onClick={this.closedeleteAccountCheck}
                >
                  X
                </div>
                <span className="deleteaccount">
                  ARE YOU SURE YOU WANT TO DELETE YOUR ACCOUNT? ALL YOUR
                  INFORMATION AND ACTIVITY WILL BE DELETED.
                </span>
                <br />
                <span
                  className="deleteaccount-decision"
                  onClick={this.deleteaccount}
                >
                  YES, DELETE MY ACCOUNT
                </span>
                <span
                  className="deleteaccount-decision"
                  onClick={this.closedeleteAccountCheck}
                >
                  NO, CANCEL
                </span>
              </div>
            </div>
          )}

          <div className="links-header">
            <Link className="link-menu" to="/chat">
              chat
            </Link>

            <Link className="link-menu" to="/exchange">
              exchange
            </Link>

            <Link className="link-menu" to="/friends">
              friends
            </Link>

            <Link className="link-menu" to="/recentusers">
              find people
            </Link>
          </div>

          <div>
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
              path="/chat"
              render={props => <Chat key={props.match.id} />}
            />
          </div>
        </BrowserRouter>
      </>
    );
  }
}
