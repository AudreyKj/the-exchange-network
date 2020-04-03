import { React, useState } from "react";
import axios from "./axios";

//hook that could be used in both the Login and Register component

export function useAuthSubmit(url, values) {
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    axios
      .post(url, values)
      .then(({ data }) => {
        if (!data.success) {
          setError(true);
        } else {
          location.replace("/");
        }
      })
      .catch(err => {
        console.log(err, "error in authebtification");
        setError(true);
      });
  };

  return [error, handleSubmit];
}
