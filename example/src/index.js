import React from "react";
import ReactDOM from "react-dom";
import firebase from "firebase";
import { Provider } from "./react-fireclient";
import "./index.css";
import App from "./App";

const firebaseConfig = {
  apiKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "xxxxxxxxxxxxxxxxxxxxxxx.firebaseapp.com",
  databaseURL: "https://xxxxxxxxxxxxxxxxxxxxxxx.firebaseio.com",
  projectId: "xxxxxxxxxxxxxxxxxxxxxxx",
  storageBucket: "xxxxxxxxxxxxxxxxxxxxxxx.appspot.com",
  messagingSenderId: "xxxxxxxxxxxx",
  appId: "x:xxxxxxxxxxxx:web:xxxxxxxxxxxxxxxxxxxxxx",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

ReactDOM.render(
  <Provider firestoreDB={db}>
    <App />
  </Provider>,
  document.getElementById("root")
);
