import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { getErrorMessage } from '../utils/error_message';

//TODO: Add data validation for <request.body>

const updateFcmTokenImpl = async (request: functions.Request, response: functions.Response) => {
    try {
        const { userId, fcmToken } = request.body;

        const usersRef = admin.firestore().collection('users').doc(userId);

        const updatedAt = admin.firestore.Timestamp.fromDate(new Date());
        const userObject = { id: userId, fcmToken, updatedAt };

        await usersRef.set(userObject).catch((error) => {
            response.status(400).send({
                status: 'Failed',
                message: getErrorMessage(error)
            });
        });

        response.status(200).send({
            status: 'Success',
            message: 'Fcm token updated sucessfully.',
            data: userObject,
        });
    } catch (error) {
        response.status(500).send({
            status: 'Failed',
            message: getErrorMessage(error),
        });
    }
}

export { updateFcmTokenImpl };
