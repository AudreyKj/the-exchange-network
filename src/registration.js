import React from "react";
import axios from "./axios";

export default class Registration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      error_emptyfields: false,
      error_last: false,
      error_email: false,
      error_password: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.submitClick = this.submitClick.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
      error_first: false,
      error_last: false,
      error_email: false,
      error_password: false
    });
  }

  submitClick(e) {
    e.preventDefault();

    const { first, last, email, password } = this.state;

    if (!this.state.first || this.state.first.length < 2) {
      this.setState({ error_first: true });
      return;
    } else if (!this.state.last || this.state.last.length < 2) {
      this.setState({ error_last: true });
      return;
    } else if (
      !this.state.email ||
      !this.state.email.includes("@") ||
      this.state.email.length < 3
    ) {
      this.setState({ error_email: true });
      return;
    } else if (!this.state.password || this.state.password.length < 5) {
      this.setState({ error_password: true });
      return;
    }

    axios
      .post("/registration/submit", this.state)
      .then(function({ data }) {
        location.replace("/");
      })
      .catch(function(error) {
        console.log("error in submit click for registration", error);

        this.setState({ error: true });
      });
  }

  render() {
    return (
      <div className="register">
        <div className="close-auth" onClick={this.props.toggleRegister}>
          X
        </div>
        <h1 className="welcome"> register </h1>
        <form>
          <label className="auth" htmlFor="code">
            first name
          </label>
          <input
            className="auth-input"
            onChange={this.handleChange}
            name="first"
            type="text"
            placeholder="first name"
            autoComplete="off"
          />
          <label className="auth" htmlFor="code">
            last name
          </label>
          <input
            className="auth-input"
            onChange={this.handleChange}
            name="last"
            type="text"
            placeholder="last name"
            autoComplete="off"
          />
          <label className="auth" htmlFor="code">
            email
          </label>
          <input
            className="auth-input"
            onChange={this.handleChange}
            name="email"
            type="text"
            placeholder="email"
            autoComplete="off"
          />
          <label className="auth" htmlFor="code">
            password
          </label>
          <input
            className="auth-input"
            onChange={this.handleChange}
            name="password"
            type="password"
            placeholder="password"
            autoComplete="off"
          />

          <button className="auth-button" onClick={this.submitClick}>
            SUBMIT
          </button>
        </form>

        {this.state.error && (
          <span className="error-register">Oops, something went wrong!</span>
        )}

        {this.state.error_first && (
          <span className="error-register">
            Oops, something went wrong! please make sure you entered your first
            name correctly.
          </span>
        )}

        {this.state.error_last && (
          <span className="error-register">
            Oops, something went wrong! please make you entered your last name
            correctly.
          </span>
        )}

        {this.state.error_email && (
          <span className="error-register">
            Oops, something went wrong! please make you entered your email
            correctly
          </span>
        )}

        {this.state.error_password && (
          <span className="error-register">
            Oops, something went wrong! please make sure your password includes
            at least 5 characters
          </span>
        )}
      </div>
    );
  }
}
