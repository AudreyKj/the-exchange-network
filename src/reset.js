import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDisplay: 1,
            reset: false,
            error: false,
            verified: true
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

        if (this.state.currentDisplay == 1) {
            const { email } = this.state;

            if (
                !this.state.email ||
                this.state.email.length < 3 ||
                !this.state.email.includes("@")
            ) {
                this.setState({ error: true });
                return;
            }

            var me = this;

            axios
                .post("/password/reset/start", me.state)
                .then(function({ data }) {
                    if (data.error) {
                        me.setState({ error: true });
                    } else {
                        me.setState({ currentDisplay: 2 });
                    }
                })
                .catch(function(error) {
                    this.setState({ error: true });
                });
        } else if (this.state.currentDisplay == 2) {
            const { code, password } = this.state;

            if (!this.state.code || !this.state.password) {
                this.setState({ error: true });
                return;
            }

            var me = this;
            axios
                .post("/password/reset/verify", me.state)
                .then(function({ data }) {
                    me.setState({ currentDisplay: 3 });
                })
                .catch(function(error) {
                    me.setState({ error: true });
                });
        }
    }

    render() {
        return (
            <div className="reset">
                {this.state.currentDisplay == 1 && (
                    <div className="reset-part1">
                        <h1 className="welcome"> RESET PASSWORD</h1>
                        <form>
                            <label htmlFor="email">
                                PLEASE ENTER YOUR EMAIL
                            </label>
                            <input
                                onChange={this.handleChange}
                                name="email"
                                type="text"
                                placeholder="email"
                                autoComplete="off"
                            />
                            <button
                                className="reset"
                                onClick={this.submitClick}
                            >
                                SUBMIT
                            </button>
                            {this.state.error && (
                                <span className="error-reset">
                                    Oops, something went wrong! Please try
                                    again.
                                </span>
                            )}
                        </form>
                    </div>
                )}
                {this.state.currentDisplay == 2 && (
                    <div className="reset-part2">
                        <form>
                            <label className="reset" htmlFor="code">
                                CODE
                            </label>
                            <input
                                onChange={this.handleChange}
                                name="code"
                                type="text"
                                placeholder="code"
                                autoComplete="off"
                            />

                            <label className="reset" htmlFor="password">
                                NEW PASSWORD
                            </label>
                            <input
                                onChange={this.handleChange}
                                name="password"
                                type="password"
                                placeholder="password"
                                autoComplete="off"
                            />
                            <button
                                className="reset-button"
                                onClick={this.submitClick}
                            >
                                submit
                            </button>
                            {this.state.error && (
                                <span className="error">
                                    Oops, something went wrong! <br /> please
                                    make sure the code matches the one we sent
                                    via email
                                </span>
                            )}
                        </form>
                    </div>
                )}

                {this.state.currentDisplay == 3 && (
                    <div>
                        <span> Success! Your Password has been changed!</span>

                        <Link className="link-auth" to="/login">
                            LOG IN HERE
                        </Link>
                    </div>
                )}
            </div>
        );
    }
}
