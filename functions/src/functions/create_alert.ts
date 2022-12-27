
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const createAlertImpl = async (request: functions.Request, response: functions.Response) => {
    try {
        const { userId, coinId, price, type } = request.body;
        const alertRef = admin.firestore().collection('alerts').doc();

        const alertObject = { id: alertRef.id, userId, coinId, price, type };
        await alertRef.set(alertObject);

        response.status(200).send({
            status: 'Success',
            message: 'Alert created sucessfully.',
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

export { createAlertImpl };