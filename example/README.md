# Fireclient Example

# Screenshots

![](https://github.com/Optimind-llc/fireclient/blob/develop/example/img/fireclient-example-screenshot1.png?raw=true)

![](https://github.com/Optimind-llc/fireclient/blob/develop/example/img/fireclient-example-screenshot2.png?raw=true)

# How to use

## Library install

```bash
yarn install
yarn start
```

## Firestore config

There are two ways.

## create `.env`

By the default, `src/firebaseConfig.js` loads `.env` in `example/.env` properties.

```
REACT_APP_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
REACT_APP_AUTH_DOMAIN=xxxxxxxxxxxxxxxxxxxxxxx.firebaseapp.com
REACT_APP_DATABASE_URL=https://xxxxxxxxxxxxxxxxxxxxxxx.firebaseio.com
REACT_APP_PROJECT_ID=xxxxxxxxxxxxxxxxxxxxxxx
REACT_APP_STORAGE_BUCKET=xxxxxxxxxxxxxxxxxxxxxxx.appspot.com
REACT_APP_MESSAGING_SENDER_ID=xxxxxxxxxxxx
REACT_APP_APP_ID=x:xxxxxxxxxxxx:web:xxxxxxxxxxxxxxxxxxxxxx
REACT_APP_MEASUREMENT_ID=xxxxxxxxxxx
```

## Modify `src/firebaseConfig.js`

Change config in `src/firebaseConfig.js` directly.

```js
const config = {
  apiKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "xxxxxxxxxxxxxxxxxxxxxxx.firebaseapp.com",
  databaseURL: "https://xxxxxxxxxxxxxxxxxxxxxxx.firebaseio.com",
  projectId: "xxxxxxxxxxxxxxxxxxxxxxx",
  storageBucket: "xxxxxxxxxxxxxxxxxxxxxxx.appspot.com",
  messagingSenderId: "xxxxxxxxxxxx",
  appId: "x:xxxxxxxxxxxx:web:xxxxxxxxxxxxxxxxxxxxxx",
  measurementId: "xxxxxxxxxxxxxx",
};
```
