import React, { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function FindPeople() {
  const [users, setUser] = useState();
  const [searchValue, setsearchValue] = useState({ val: "" });
  const [results, setResults] = useState(false);
  const [noResult, setnoResults] = useState(false);

  useEffect(() => {
    let abort;
    (async () => {
      const { data } = await axios.get("/api/recentusers");
      setUser(data);

      const result = [];

      const searchData = await axios.get(`/search/${searchValue.val}`);

      if (searchValue === "" || !Array.isArray(searchData.data)) {
        return;
      } else if (searchValue !== "" && Array.isArray(searchData.data)) {
        setResults(searchData.data);
        setnoResults(false);
      }
    })();
  }, [searchValue]);

  return (
    <div className="find-people-wrapper">
      <div className="find-people">
        <span className="section-title">FIND PEOPLE</span>
        <input
          className="find-people"
          onChange={({ target }) =>
            setsearchValue({
              val: target.value
            })
          }
          placeholder="who are you looking for"
        />
        <div className="otherprofiles-wrapper">
          <div className="recent-users">
            {users && <span className="findpeople">most recent users</span>}
            {users &&
              users.map(user => (
                <div key={user.id} className="otherprofiles">
                  <img
                    className="otherprofile"
                    src={user.url || "/default-user-avatar.png"}
                    alt={(user.first, user.last)}
                  />

                  <Link to={`/user/${user.id}`}>
                    {user.first}&nbsp;
                    {user.last}
                  </Link>
                </div>
              ))}
          </div>

          {results &&
            results.map(user => (
              <div key={user.id} className="otherprofiles">
                <img
                  className="otherprofile"
                  src={user.url || "/default-user-avatar.png"}
                  alt={(user.first, user.last)}
                />
                <Link to={`/user/${user.id}`}>
                  {user.first}&nbsp;
                  {user.last}
                </Link>
              </div>
            ))}

          {noResult && <span className="findpeople"> no results found </span>}
        </div>
      </div>
    </div>
  );
}
