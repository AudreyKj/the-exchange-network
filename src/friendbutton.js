import React, { useEffect, useState } from "react";
import axios from "./axios";

export default function FriendButton({ otherUserId }) {
  const [buttonText, setButtonText] = useState("Make Friend Request");
  useEffect(() => {
    (async () => {
      const { data } = await axios.get(`/friends/${otherUserId}`);

      if (data === undefined) {
        return setButtonText("Make Friend Request");
      } else if (
        data.data.accepted === true &&
        data.data.receiver_id == otherUserId
      ) {
        return setButtonText("End Friendship");
      } else if (
        data.data.receiver_id == otherUserId &&
        data.data.accepted === false
      ) {
        return setButtonText("cancel friend request");
      } else if (data.data.sender_id == otherUserId) {
        return setButtonText("Accept Friend Request");
      }
    })();
  }, []);

  const handleClick = e => {
    e.preventDefault();

    if (buttonText === "Make Friend Request") {
      axios
        .post(`/make-friend-request/${otherUserId}`)
        .then(function({ data }) {
          return setButtonText("cancel friend request");
        })
        .catch(function(error) {
          console.log("error in click - friendship", error);
        });
    } else if (buttonText === "Accept Friend Request") {
      axios
        .post(`/accept-friend-request/${otherUserId}`)
        .then(function({ data }) {
          return setButtonText("End Friendship");
        })
        .catch(function(error) {
          console.log("error in click friendship", error);
        });
    } else if (
      buttonText === "End Friendship" ||
      buttonText === "cancel friend request"
    ) {
      axios
        .post(`/end-friendship/${otherUserId}`)
        .then(function({ data }) {
          setButtonText("Make Friend Request");
        })
        .catch(function(error) {
          console.log("error in click friendship", error);
        });
    }
  };

  return (
    <button className="friend-button" onClick={handleClick}>
      {buttonText}
    </button>
  );
}
