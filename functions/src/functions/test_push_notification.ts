// In this file I test anything I would like to check if it works correctly.
// Delete this file when it is unused.

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { getErrorMessage } from '../utils/error_message';

const testPushNotificationImpl = async (request: functions.Request, response: functions.Response) => {
    try {
        const { fcmToken } = request.body;

        await sendPushNotification(fcmToken);
        functions.logger.log(`Sending alert to this token = ${fcmToken}`);

        const successMessage = { 'message': 'Push notification sent successfully.' };
        response.status(200).send(successMessage);
    } catch (error) {
        response.status(500).send({
            status: 'Failed',
            message: getErrorMessage(error),
        });
    }
}

const sendPushNotification = async (fcmToken: string): Promise<void> => {
    if (!fcmToken) return Promise.resolve();

    const message = {
        token: fcmToken,
        notification: {
            title: 'Testing',
            body: 'Confly push notification works!',
        },
    };

    await admin.messaging().send(message);
}

export { testPushNotificationImpl };
