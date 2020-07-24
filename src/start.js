import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import Welcome from "./welcome";
import App from "./app";
import { init } from "./socket";

//redux boilerplate code
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./reducer.js";

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(reduxPromise))
);

let elem;

if (location.pathname === "/welcome") {
  elem = (
    <BrowserRouter>
      <Welcome />
    </BrowserRouter>
  );
} else {
  init(store);
  elem = (
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  );
}

ReactDOM.render(elem, document.querySelector("main"));
