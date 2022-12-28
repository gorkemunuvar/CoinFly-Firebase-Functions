import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { createAlertImpl } from './functions/create_alert';
import { updateAlertImpl } from './functions/update_alert';
import { deleteAlertImpl } from './functions/delete_alert';

admin.initializeApp();

export const createAlert = functions.https.onRequest(createAlertImpl);
export const updateAlert = functions.https.onRequest(updateAlertImpl);
export const deleteAlert = functions.https.onRequest(deleteAlertImpl);