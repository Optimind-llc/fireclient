require("dotenv").config();

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

// const config = {
//   apiKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
//   authDomain: "xxxxxxxxxxxxxxxxxxxxxxx.firebaseapp.com",
//   databaseURL: "https://xxxxxxxxxxxxxxxxxxxxxxx.firebaseio.com",
//   projectId: "xxxxxxxxxxxxxxxxxxxxxxx",
//   storageBucket: "xxxxxxxxxxxxxxxxxxxxxxx.appspot.com",
//   messagingSenderId: "xxxxxxxxxxxx",
//   appId: "x:xxxxxxxxxxxx:web:xxxxxxxxxxxxxxxxxxxxxx",
//   measurementId: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
// };

export default config;
