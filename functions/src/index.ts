import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true });
  response.send('Hello from Firebase!');
});

export const createAlert = functions.https.onRequest((request, response) => {
  try {
    const body = request.body;
    functions.logger.info(body);

    const alertRef = admin.firestore().collection('alerts').doc();
    alertRef.create(body);

    response.send('Alert created successfully!');
  } catch (error) {
    functions.logger.info('Here is the error message: ', { structuredData: true });
    functions.logger.info(error, { structuredData: true });
    response.send('Something went wrong!');
  }
});