import firebase from "firebase";
import firebaseConfig from "./firebaseConfig";

console.log(firebaseConfig);

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
export default db;
