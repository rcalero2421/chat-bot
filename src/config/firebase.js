const admin = require('firebase-admin');

const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const projectId = process.env.FIREBASE_PROJECT_ID;
const databaseURL = process.env.FIREBASE_DATABASE_URL;

if (!clientEmail || !privateKey || !projectId) {
    throw new Error("⚠️ Error: Variables de entorno de Firebase no definidas.");
}

admin.initializeApp({
    credential: admin.credential.cert({
        client_email: clientEmail,
        private_key: privateKey,
        project_id: projectId
    }),
    databaseURL: databaseURL
});

const db = admin.firestore();
const usersCollection = db.collection('chats');

module.exports = { db, usersCollection };
