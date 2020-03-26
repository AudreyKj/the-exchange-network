import React from "react";
import axios from "./axios";
import Profile from "./profile";
import { Link } from "react-router-dom";
import { HashRouter, Route } from "react-router-dom";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bioEditorIsVisible: false,
            bio: this.props.bio,
            setBio: this.props.setBio,
            error: false
        };

        this.onClick = this.onClick.bind(this);
        this.submitClick = this.submitClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    //show textarea to add or edit bio on click
    onClick() {
        this.setState({ bioEditorIsVisible: true });
    }

    //textarea value
    handleChange(e) {
        this.setState({ bio: e.target.value });
    }

    //submit bio
    submitClick(e) {
        e.preventDefault();

        axios
            .post("/uploadbio", this.state)
            .then(({ data }) => {
                this.props.setBio(data);

                this.setState({ bioEditorIsVisible: false });
            })
            .catch(function(error) {
                console.log("error in submitting bio", error);
            });
    }

    render() {
        return (
            <div className="bio-editing-section">
                {!this.state.bio && (
                    <>
                        <button className="addbio" onClick={this.onClick}>
                            ADD A BIO
                        </button>
                    </>
                )}

                {this.state.bio && (
                    <>
                        <button className="editbio" onClick={this.onClick}>
                            EDIT YOUR BIO
                        </button>
                    </>
                )}

                {this.state.bioEditorIsVisible && (
                    <>
                        <div className="bioeditor">
                            <form
                                className="bioeditor-form"
                                action="/uploadbio"
                                method="post"
                                id="form_bio"
                            >
                                <label htmlFor="edityourbio">
                                    <textarea
                                        className="bioeditor-textarea"
                                        name="bio"
                                        form="form_bio"
                                        rows="3"
                                        cols="50"
                                        onChange={this.handleChange}
                                        value={this.state.bio}
                                    ></textarea>
                                </label>
                                <button onClick={this.submitClick}>SAVE</button>
                            </form>
                        </div>

                        {this.state.error && (
                            <span className="error">
                                Oops, something went wrong! please try again.
                            </span>
                        )}
                    </>
                )}
            </div>
        );
    }
}
