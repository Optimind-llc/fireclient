import React from "react";
import ReactDOM from "react-dom";
import firebase from "firebase";
import { Provider } from "./react-fireclient";
import "./index.css";
import App from "./App";

const firebaseConfig = {
  apiKey: "AIzaSyANecO3eqcFD5m9MpJn8hEoqIEffQ014s8",
  authDomain: "fireclient-private-test.firebaseapp.com",
  databaseURL: "https://fireclient-private-test.firebaseio.com",
  projectId: "fireclient-private-test",
  storageBucket: "fireclient-private-test.appspot.com",
  messagingSenderId: "153859418242",
  appId: "1:153859418242:web:8d7ec4942f81cd7ee72c9b",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

ReactDOM.render(
  <Provider firestoreDB={db}>
    <App />
  </Provider>,
  document.getElementById("root"),
);
