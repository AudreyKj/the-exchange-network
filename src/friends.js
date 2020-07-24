import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { receiveFriendsWannabes } from "./actions.js";
import { acceptFriendRequest } from "./actions.js";
import { unfriend } from "./actions.js";

import { Link } from "react-router-dom";

export default function Friends() {
  const friends = useSelector(
    state =>
      state.friendsWannabes &&
      state.friendsWannabes.filter(friend => {
        return friend.accepted === true;
      })
  );

  const requesters = useSelector(
    state =>
      state.friendsWannabes &&
      state.friendsWannabes.filter(friend => {
        return friend.accepted === false;
      })
  );

  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      dispatch(receiveFriendsWannabes());
    })();
  }, []);

  return (
    <div className="friendswannabes">
      <span className="section-title">
        FRIENDS <br />
      </span>
      <div className="friends-requesters-container">
        <span className="friendswannabes-text">
          All your friends and requests are listed here. <br />
          <br /> Go to&nbsp;
          <Link to="/recentusers">find people</Link>
          &nbsp; to make new friends.
        </span>
        {requesters &&
          requesters.map(user => (
            <div className="friendwannabe-single-user" key={user.id}>
              <span className="friends-requesters">FRIEND REQUEST</span>

              <img
                className="image-friends-requesters"
                src={user.url || "/default-user-avatar.png"}
                alt={(user.first, user.last)}
              />
              <Link to={`/user/${user.id}`}>
                {user.first}&nbsp;
                {user.last}
              </Link>
              <button
                className="friends-accept button-friends-requesters"
                onClick={() => dispatch(acceptFriendRequest(user.id))}
              >
                Accept friend request
              </button>
            </div>
          ))}
      </div>
      <div className="friends-requesters-container">
        {friends &&
          friends.map(user => (
            <div className="friendwannabe-single-user" key={user.id}>
              <span className="friends-requesters">CURRENT FRIEND</span>

              <img
                className="image-friends-requesters"
                src={user.url || "/default-user-avatar.png"}
                alt={(user.first, user.last)}
              />
              <Link to={`/user/${user.id}`}>
                {user.first}&nbsp;
                {user.last}
              </Link>
              <button
                className="friends-unfriend button-friends-requesters"
                onClick={() => dispatch(unfriend(user))}
              >
                End friendship
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
