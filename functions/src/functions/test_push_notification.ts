// In this file I test anything I would like to check if it works correctly.
// Delete this file when it is unused.

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { getErrorMessage } from '../utils/error_message';

const testPushNotificationImpl = async (request: functions.Request, response: functions.Response) => {
    try {
        const { fcmToken } = request.body;

        await sendPushNotification(fcmToken);

        const successMessage = { 'message': 'Push notification sent successfully.' };
        response.status(200).send(successMessage);
    } catch (error) {
        response.status(500).send({
            status: 'Failed',
            message: getErrorMessage(error),
        });
    }
}



function sendPushNotification(fcmToken: string): Promise<void> {
    if (!fcmToken) return Promise.resolve();

    const payload = {
        notification: {
            title: 'Testing',
            body: 'Confly push notification works!',
        }
    };

    const options = {
        priority: 'high',
        timeToLive: 60 * 60 * 24
    };

    admin.messaging().sendToDevice(fcmToken, payload, options)
        .then((response) => {
            functions.logger.log(`Sending alert to this token = ${fcmToken}`);
        })
        .catch((error) => {
            console.log('Error sending message:', getErrorMessage(error));
        });


    return Promise.resolve();
}

export { testPushNotificationImpl };
