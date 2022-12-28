
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

//TODO: Add data validation for <request.body>

const updateAlertImpl = async (request: functions.Request, response: functions.Response) => {
    try {
        const { id, userId, coinId, price, type } = request.body;

        const alertRef = admin.firestore().collection('alerts').doc(id);
        const alertSnapshot = await alertRef.get();

        if (!alertSnapshot.exists || alertSnapshot.get('userId') !== userId) {
            throw new functions.https.HttpsError(
                'not-found',
                'The specified alert was not found or does not belong to the current user.',
            );
        }

        const alertObject = {
            id: id || alertSnapshot.get('id'),
            userId: alertSnapshot.get('userId'),
            coinId: alertSnapshot.get('coinId'),
            price: price || alertSnapshot.get('price'),
            type: type || alertSnapshot.get('type'),
        };

        await alertRef.update(alertObject).catch((error) => {
            return response.status(400).json({
                status: 'Failed',
                message: error.message,
            });
        });

        response.status(200).send({
            status: 'Success',
            message: 'Alert updated sucessfully.',
            data: alertObject,
        });
    } catch (error) {
        let message = 'Unknown Error';
        if (error instanceof Error) message = error.message;

        response.status(500).send({
            status: 'Failed',
            message: message,
        });
    }

}

export { updateAlertImpl };