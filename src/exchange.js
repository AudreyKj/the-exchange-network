import React, { useState, useEffect } from "react";
import axios from "./axios";
import Moment from "react-moment";

export default function Exchange() {
  const [exchangeInfo, setexchangeInfo] = useState();
  const [newExchange, setnewExchange] = useState();
  const [newPost, setnewPost] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    (async () => {
      const { data } = await axios.get("/getexchanges");

      setexchangeInfo(data);
    })();
  }, []);

  const handleClick = e => {
    e.preventDefault();

    if (
      newExchange.title === undefined ||
      newExchange.title.length === 0 ||
      newExchange.title.length < 3 ||
      (newExchange.city === undefined ||
        newExchange.city.length === 0 ||
        newExchange.city.length === 1) ||
      (newExchange.description === undefined ||
        newExchange.description.length === 0 ||
        newExchange.description.length < 10) ||
      newExchange.privacy === undefined
    ) {
      return setError(true);
    }

    axios
      .post("/postexchange", newExchange)
      .then(function(data) {
        setnewPost(data.data);
        return;
      })
      .catch(function(error) {
        console.log("error in submit exchange", error);
      });
  };

  const handleChange = e => {
    setError(false);

    setnewExchange({ ...newExchange, [e.target.name]: e.target.value });

    return;
  };

  return (
    <div className="exchange-wrapper">
      <div className="exchange">
        <span className="section-title"> EXCHANGE </span>

        <form className="form-exchange">
          EXCHANGE SERVICES, LANGUAGES, OR SKILLS WITH OTHER USERS!
          <br />
          <br />
          <label className="exchange" htmlFor="title">
            ECHANGE TYPE
          </label>
          <input
            className="exchange-input"
            placeholder="exchange type"
            name="title"
            type="text"
            autoComplete="off"
            onChange={handleChange}
            required
          />
          <label className="exchange" htmlFor="title">
            CITY
          </label>
          <input
            className="exchange-input"
            placeholder="city"
            name="city"
            type="text"
            autoComplete="off"
            onChange={handleChange}
            required
          />
          <label className="exchange" htmlFor="title">
            PRIVATE POST
          </label>
          <input
            type="radio"
            name="privacy"
            value="onlyFriends"
            onChange={handleChange}
            required
          />
          <label className="exchange" htmlFor="title">
            PUBLIC POST
          </label>
          <input
            type="radio"
            name="privacy"
            value="public"
            onChange={handleChange}
            required
          />
          <label className="exchange" htmlFor="title">
            DESCRIPTION (max 150 char.)
          </label>
          <textarea
            rows="3"
            cols="45"
            maxLength="150"
            required
            className="exchange-input"
            placeholder="description"
            name="description"
            type="text"
            autoComplete="off"
            onChange={handleChange}
          ></textarea>
          <button className="exchange" onClick={handleClick}>
            SUBMIT
          </button>
          {error && (
            <span className="error">
              Error: please make sure all fields are filled in correctly.
            </span>
          )}
        </form>
      </div>
      {newPost && (
        <div className="exchange-list newexchange">
          <p>
            {newPost.first}&nbsp;{newPost.last}
            &nbsp;--&nbsp;
            <span className="exchange-type">{newPost.title}&nbsp;--&nbsp;</span>
            <span className="exchange-city">{newPost.city}</span>
          </p>
          <p>{newPost.description}</p>
          <p className="time-exchange">
            <Moment fromNow>{newPost.created_at}</Moment>
          </p>
        </div>
      )}

      <div className="echange-wrapper">
        {exchangeInfo &&
          exchangeInfo.map(exchange => (
            <div className="exchange-list" key={exchange.id}>
              <p>
                {exchange.first}&nbsp;{exchange.last}
                &nbsp;--&nbsp;
                <span className="exchange-type">
                  {exchange.title}&nbsp;--&nbsp;
                </span>
                <span className="exchange-city">{exchange.city}</span>
              </p>
              <p>{exchange.description}</p>
              <p className="time-exchange">
                <Moment fromNow>{exchange.created_at}</Moment>
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
