const firestoreService = require("firestore-export-import");
const serviceAccount = require("./serviceAccountKey.json");

const databaseUrl = "https://xxxxxxxxxxxxxx.firebaseio.com";

// Initiate Firebase App
firestoreService.initializeApp(serviceAccount, databaseUrl);

// Start importing your data
// The array of date and location fields are optional
firestoreService.restore("./backup1.json");
firestoreService.restore("./backup2.json", [], ["location"]);
firestoreService.restore("./backup3.json", ["time"], []);
