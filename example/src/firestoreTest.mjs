import firebaseConfig from "./firebaseConfig.json";
import firebase from "firebase";
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Create an initial document to update.
const frankDocRef = db.collection("users").doc("frank");
frankDocRef.set({
  name: "Frank",
  favorites: { food: "Pizza", color: "Blue", subject: "recess" },
  age: 12,
});
// To update age and favorite color:
db.collection("users")
  .doc("frank")
  .update({
    age: 13,
    "favorites.color": "Red",
  });
