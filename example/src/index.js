import React from "react";
import ReactDOM from "react-dom";
import firebase from "firebase";
import { FireclientProvider } from "react-fireclient";
import "./index.css";
import App from "./App";
import firebaseConfig from "./firebaseConfig";

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

ReactDOM.render(
  <FireclientProvider firestoreDB={db} onAccess={() => console.log("trying to access firestore")}>
    <App />
  </FireclientProvider>,
  document.getElementById("root"),
);
