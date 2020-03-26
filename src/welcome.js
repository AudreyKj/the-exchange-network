import React from "react";
import Registration from "./registration";
import Login from "./login";
import Shape from "./shape";
import ResetPassword from "./reset";
import { Link } from "react-router-dom";
import { HashRouter, Route } from "react-router-dom";

export default function Welcome() {
    return (
        <div id="welcome">
            <div className="title-socialnetwork">
                <h1 className="welcome">THE SOCIAL NETWORK</h1>
                <span className="network-motto">
                    EXCHANGE LANGUAGES, SKILLS, OR ACTIVITIES WITH YOUR FRIENDS!
                </span>
                <HashRouter>
                    <div className="auth-link-wrapper">
                        <Link className="auth-link" to="/login">
                            LOGIN
                        </Link>
                        <Link className="auth-link" to="/register">
                            REGISTER
                        </Link>
                    </div>

                    <Route exact path="/register" component={Registration} />

                    <Route exact path="/login" component={Login} />

                    <Route exact path="/reset" component={ResetPassword} />
                </HashRouter>
            </div>

            <div className="shape-container">
                <Shape> </Shape>
            </div>
        </div>
    );
}
