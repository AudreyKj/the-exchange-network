import React from "react";

//hook that could be used in both the Login and Register component

export function useStatefulFields() {
  const [values, setValues] = useState({});

  const handleChange = e => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    });
  };

  return [values, handleChange];
}
