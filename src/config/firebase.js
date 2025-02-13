const admin = require('firebase-admin');
const serviceAccount = require('../../firebase-service-account.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://chatbot-a916d.firebaseio.com"
});

const db = admin.firestore();
const usersCollection = db.collection('chats');
module.exports = { db, usersCollection };
