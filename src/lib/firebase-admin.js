import admin from 'firebase-admin';

// Check if app is already initialized
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Replace \\n with \n to ensure correct parsing
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

// Export the initialized admin app
export const db = admin.firestore();
export const FieldValue = admin.firestore.FieldValue;
export default admin;