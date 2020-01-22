import React from "react";
import ReactDOM from "react-dom";
import firebase from "firebase";
import { Provider } from "./react-fireclient";
import "./index.css";
import App from "./App";
import firebaseConfig from "./firebaseConfig.json";

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

ReactDOM.render(
  <Provider firestoreDB={db}>
    <App />
  </Provider>,
  document.getElementById("root"),
);
