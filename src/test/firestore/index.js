import firebase from "firebase";
import firebaseConfig from "./firebaseConfig.json";

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
export default db;
