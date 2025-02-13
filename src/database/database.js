const { usersCollection } = require('../config/firebase');

const saveUserResponse = async (chatId, data) => {
    try {
        await usersCollection.doc(chatId).set(data, { merge: true });
    } catch (error) {
        console.error('Error guardando en Firebase:', error);
    }
};

const getUserResponse = async (chatId) => {
    try {
        const doc = await usersCollection.doc(chatId).get();
        return doc.exists ? doc.data() : null;
    } catch (error) {
        console.error('Error obteniendo datos de Firebase:', error);
        return null;
    }
};

const getAllUsers = async () => {
    try {
        const snapshot = await usersCollection.get();
        return snapshot.docs.map(doc => doc.data());
    } catch (error) {
        console.error('Error obteniendo datos de Firebase:', error);
        return [];
    }
};
module.exports = { saveUserResponse, getUserResponse, getAllUsers };
