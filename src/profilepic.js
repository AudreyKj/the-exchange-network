import React from "react";

export default function({
    url = "/default-user-avatar.png",
    first,
    last,
    toggleModal
}) {
    console.log("url in profilepic", url);
    return (
        <img
            className="profilepic pic-header"
            onClick={toggleModal}
            src={url || "/default-user-avatar.png"}
            alt={`${first} ${last}`}
        />
    );
}
