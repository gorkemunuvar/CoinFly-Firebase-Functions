import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import * as  cfFunctions from './functions';

admin.initializeApp();

export const createAlert = functions.https.onRequest(cfFunctions.createAlertImpl);
export const updateAlert = functions.https.onRequest(cfFunctions.updateAlertImpl);
export const deleteAlert = functions.https.onRequest(cfFunctions.deleteAlertImpl);
export const getAlertsByUserId = functions.https.onRequest(cfFunctions.getAlertsByUserIdImpl);