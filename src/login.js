import React from "react";
import axios from "./axios";
import Welcome from "./welcome.js";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    console.log("props", props);
    this.state = {
      error: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.submitClick = this.submitClick.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
      error: false
    });
  }

  submitClick(e) {
    e.preventDefault();

    const { email, password } = this.state;

    if (!this.state.email || this.state.email.length < 3) {
      this.setState({ error: true });
      return;
    } else if (!this.state.password || this.state.password.length < 5) {
      this.setState({ error: true });
      return;
    }
    var me = this;

    axios
      .post("/login/submit", { email, password })
      .then(function({ data }) {
        if (data.error) {
          me.setState({ error: true });
          return;
        }

        location.replace("/");
      })
      .catch(function(error) {
        this.setState({ error: true });
      });
  }

  render() {
    return (
      <div className="login">
        <div className="close-auth" onClick={this.props.toggleLogin}>
          X
        </div>
        <h1 className="welcome"> LOGIN </h1>
        <form>
          <label htmlFor="code">email</label>
          <input
            className="auth-input"
            onChange={this.handleChange}
            name="email"
            type="text"
            placeholder="email"
            autoComplete="off"
          />
          <label htmlFor="code">password</label>
          <input
            className="auth-input"
            onChange={this.handleChange}
            name="password"
            type="password"
            placeholder="password"
            autoComplete="off"
          />

          <button className="auth" onClick={this.submitClick}>
            SUBMIT
          </button>
        </form>

        {this.state.error && (
          <span className="error-login">
            Authentification failed: please make sure you entered the right
            password and email.
          </span>
        )}
      </div>
    );
  }
}
