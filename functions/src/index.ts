import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import * as  cfFunctions from './functions';

admin.initializeApp();

// Alerts

export const createAlert = functions.https.onRequest(cfFunctions.createAlertImpl);
export const updateAlert = functions.https.onRequest(cfFunctions.updateAlertImpl);
export const deleteAlert = functions.https.onRequest(cfFunctions.deleteAlertImpl);
export const getAlertsByUserId = functions.https.onRequest(cfFunctions.getAlertsByUserIdImpl);

export const testing = functions.https.onRequest(cfFunctions.testingImpl);
export const testPushNotification = functions.https.onRequest(cfFunctions.testPushNotificationImpl);

const checkAlertsInterval = 'every 1 minutes';
export const checkAlerts = functions.pubsub.schedule(checkAlertsInterval).onRun(cfFunctions.checkAlertsImpl);

// FCM Token Management

export const updateFcmToken = functions.https.onRequest(cfFunctions.updateFcmTokenImpl);
