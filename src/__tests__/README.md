# Fireclient test

To test our library, you have to import our Firestore backup.

[dalenguyen/firestore-backup-restore](https://github.com/dalenguyen/firestore-backup-restore)
enables us to do it.

## Setup Firestore for test

1. Install library

```
yarn install
```

2. Modify below files for your environment.

- `firestore/firebaseConfig.json`
- `serviceAccountKey.json`
- `databaseUrl` in `importFirestoreBackup.js`

3. Import test data into your Firestore.

```
node importFirestoreBackup.js
```

4. Define composite indexes in Firestore

CollectionID : cities

1 - population / Acending

2 - foo / Ascending

5. Run test by executing below.

```
yarn test
```
