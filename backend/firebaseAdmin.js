const admin = require('firebase-admin');

if (!admin.apps.length) {
  if (process.env.FIREBASE_PRIVATE_KEY) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId:   process.env.FIREBASE_PROJECT_ID   || 'afripredict',
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey:  process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
    console.log('✅  Firebase Admin: initialized');
  } else {
    console.warn('⚠️   Firebase Admin: FIREBASE_PRIVATE_KEY not set — token signatures will NOT be verified (dev only)');
  }
}

// Export admin if initialized, null otherwise (middleware checks for null and runs in dev mode)
module.exports = admin.apps.length ? admin : null;
