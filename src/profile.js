import React from "react";
import ProfilePic from "./profilepic.js";
import BioEditor from "./bioeditor.js";
import App from "./app";
import Exchange from "./exchange.js";
import Uploader from "./uploader.js";
import axios from "./axios";

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploaderVisible: false,
      id: this.props.id,
      first: this.props.first,
      last: this.props.last,
      image: this.props.image,
      bio: this.props.bio,
      setBio: this.props.setBio,
      uploaderVisible: this.props.uploaderVisible
    };
    this.toggleModal = this.toggleModal.bind(this);
    console.log(props);
  }

  toggleModal() {
    if (!this.state.uploaderVisible) {
      this.setState({ uploaderVisible: true });
    } else {
      this.setState({ uploaderVisible: false });
    }
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
    return (
      <>
        <div className="profile-container">
          <div className="profile-wrapper">
            <span className="bio">{this.state.bio}</span>
            <ProfilePic
              first={this.props.first}
              last={this.props.last}
              url={this.props.url}
            />
            <span className="greeting">
              hello {this.props.first} {this.props.last} !{" "}
            </span>
            <button onClick={this.toggleModal}> change profile pic </button>
            <button onClick={this.deleteaccount}>delete account</button>
            <BioEditor
              bio={this.props.bio}
              bioEditorIsVisible={this.bioEditorIsVisible}
              setBio={newBio =>
                this.setState({
                  bio: newBio
                })
              }
            />
            <button onClick={this.logout}>logout</button>
          </div>
        </div>

        {this.state.uploaderVisible && (
          <Uploader
            finishedUploading={newUrl =>
              this.setState({
                url: newUrl
              })
            }
          />
        )}
      </>
    );
  }
}
