import * as admin from 'firebase-admin';

const serviceAccount = require('../../sc2-arena-firebase-adminsdk.json');


export const Admin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
