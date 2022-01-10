import functions = require("firebase-functions");
import admin = require("firebase-admin");
const serviceAccount =
require("medication-98c5a-firebase-adminsdk-7pk8h-cb5a159660.json");

export const removeUser = functions.firestore.document("/Nutzer/{uid}")
    .onDelete((snapshot, context) => {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://medication-98c5a.firebaseio.com",
      });
      return admin.auth().deleteUser(context.params.uid);
    });
