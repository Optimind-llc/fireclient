import React from "react";
import ReactDOM from "react-dom";
import firebase from "firebase";
import { Provider } from "./react-fireclient";
import "./index.css";
import App from "./App";
import firebaseConfig from "./firebaseConfig";

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

ReactDOM.render(
  <Provider firestoreDB={db} onAccess={() => console.log("trying to access firestore")}>
    <App />
  </Provider>,
  document.getElementById("root"),
);
