
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { getErrorMessage } from '../utils/error_message';

//TODO: Add data validation for <request.body>

const createAlertImpl = async (request: functions.Request, response: functions.Response) => {
    try {
        const { userId, coinId, price, type } = request.body;

        const alertRef = admin.firestore().collection('alerts').doc();

        const alertObject = {
            id: alertRef.id, createdAt: Date.now(), userId, coinId, price, type, isActive: true,
        };
        await alertRef.set(alertObject);

        response.status(200).send({
            status: 'Success',
            message: 'Alert created sucessfully.',
            data: alertObject,
        });

    } catch (error) {
        response.status(500).send({
            status: 'Failed',
            message: getErrorMessage(error),
        });
    }
}

export { createAlertImpl };