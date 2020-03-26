import React from "react";
import axios from "./axios";
import FriendButton from "./friendbutton.js";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        axios
            .get(`/user/profile/${this.props.match.params.id}.json`)
            .then(({ data }) => {
                if (data.redirectTo == "/") {
                    this.props.history.push("/");
                } else {
                    this.setState({
                        id: data.result.rows[0].id,
                        first: data.result.rows[0].first,
                        last: data.result.rows[0].last,
                        bio: data.result.rows[0].bio,
                        url: data.result.rows[0].url
                    });
                }
            });
    }
    render() {
        return (
            <div className="other-profiles-wrapper">
                <div className="other-profiles">
                    {this.state.first} {this.state.last}
                    <span className="bio">{this.state.bio}</span>
                    <img
                        className="profilepic"
                        src={this.state.url || "/default-user-avatar.png"}
                        alt={`${this.state.first} ${this.state.last}`}
                    />
                    <FriendButton
                        otherUserId={this.props.match.params.id}
                        userId={this.props.id}
                    />
                </div>
            </div>
        );
    }
}
