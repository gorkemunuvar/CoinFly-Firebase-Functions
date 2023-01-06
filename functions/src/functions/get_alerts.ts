
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { getErrorMessage } from '../utils/error_message';

//TODO: Add data validation for <request.body>

const getAlertsByUserIdImpl = async (request: functions.Request, response: functions.Response) => {
    try {
        const { userId } = request.body;

        const alertsRef = await admin.firestore().collection('alerts');
        const alertsSnapshot = await alertsRef.where('userId', '==', userId).get();

        const alerts = alertsSnapshot.docs.map(doc => doc.data());
        response.status(200).send({ alerts: alerts });
    } catch (error) {
        response.status(500).send({
            status: 'Failed',
            message: getErrorMessage(error),
        });
    }
}

export { getAlertsByUserIdImpl };
