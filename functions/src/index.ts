import * as functions from "firebase-functions";
import * as admin from 'firebase-admin';

admin.initializeApp();

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

export const createAlert = functions.https.onCall(async (data: {
  alertId: string, userId: string, coinId: string, price: number, type: string,
}, context
) => {
  const { alertId, userId, coinId, price, type } = data;

  // Create a new alert document in the alerts collection
  const alertRef = admin.firestore().collection('alerts').doc(alertId);
  await alertRef.set({ userId, coinId, price, type });

  return { message: 'Alert created successfully!' };
});