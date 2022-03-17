/* import React from "react";
import ReactDOM from "react-dom";

import "react-day-picker/lib/style.css";

import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./redux/redux";

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);

reportWebVitals(); */

import React from "react";
import ReactDOM,{ render, hydrate } from "react-dom";

import "react-day-picker/lib/style.css";

import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./redux/redux";
import { BrowserRouter } from 'react-router-dom';
const rootElement = document.getElementById('root');

if (rootElement.hasChildNodes()) {
  hydrate(
    <Provider store={store}>
      <BrowserRouter>
      <React.StrictMode>
        <App />
      </React.StrictMode>
      </BrowserRouter>
    </Provider>,
    rootElement
  );
} else {
  render(
    <Provider store={store}>
      <BrowserRouter>
      <React.StrictMode>
        <App />
      </React.StrictMode>
      </BrowserRouter>
    </Provider>,
    rootElement
  );
}
reportWebVitals();