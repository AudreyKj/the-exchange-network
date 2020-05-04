import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";
import Moment from "react-moment";

export function Chat() {
  const chatMessages = useSelector(state => state && state.chatMessages);
  const elementRef = useRef();

  useEffect(() => {
    elementRef.current.scrollTop =
      elementRef.current.scrollHeight - elementRef.current.clientHeight;
  }, [chatMessages]);

  const keyCheck = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      socket.emit("newChatMessage", e.target.value);
      e.target.value = "";
    }
  };
  return (
    <div className="chat-wrapper">
      <span className="chat-title"> CHAT </span>
      <div className="chat" ref={elementRef}>
        {chatMessages &&
          chatMessages.map(message => (
            <div className="message" key={message.id}>
              <div className="image-info-msg">
                <img
                  className="chat-img"
                  src={message.url || "/default-user-avatar.png"}
                  alt={(message.first, message.last)}
                />
                &nbsp;{message.first} {message.last}
                &nbsp;---&nbsp;
                <span className="chat-date">
                  <Moment fromNow>{message.created_at}</Moment>
                </span>
              </div>

              <br />
              {message.message}
            </div>
          ))}

        <textarea
          rows="4"
          cols="40"
          placeholder="write here - press Enter to submit"
          onKeyDown={keyCheck}
          className="chat-textarea"
        ></textarea>
      </div>
    </div>
  );
}
