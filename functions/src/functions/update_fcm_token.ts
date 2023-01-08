
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { getErrorMessage } from '../utils/error_message';

//TODO: Add data validation for <request.body>

const updateFcmTokenImpl = async (request: functions.Request, response: functions.Response) => {
    try {
        const { userId, fcmToken, updatedAt } = request.body;

        const usersRef = admin.firestore().collection('users').doc(userId);
        const userSnapshot = await usersRef.get();

        if (!userSnapshot.exists) {
            throw new functions.https.HttpsError(
                'not-found',
                'The specified user was not found.'
            )
        }

        const userObject = { id: userId, fcmToken: fcmToken, updatedAt: updatedAt };

        await usersRef.set(userObject).catch((error) => {
            response.status(400).send({
                status: 'Failed',
                message: getErrorMessage(error)
            });
        });


    } catch (error) {
        response.status(500).send({
            status: 'Failed',
            message: getErrorMessage(error),
        });
    }
}

export { updateFcmTokenImpl };
