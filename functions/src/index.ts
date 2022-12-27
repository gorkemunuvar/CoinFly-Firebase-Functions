import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { createAlertImpl } from './functions/create_alert';

admin.initializeApp();

export const createAlert = functions.https.onRequest(createAlertImpl);
