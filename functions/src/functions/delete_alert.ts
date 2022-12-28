
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { getErrorMessage } from '../utils/error_message';

//TODO: Add data validation for <request.body>

const deleteAlertImpl = async (request: functions.Request, response: functions.Response) => {
  try {
    const { id } = request.body;

    const alert = admin.firestore().collection('alerts').doc(id);

    await alert.delete().catch((error) => {
      response.status(400).send({
        status: 'Failed',
        message: getErrorMessage(error),
      });
    });

    response.status(200).send({
      status: 'Success',
      message: 'Alert deleted successfully.',
    });
  } catch (error) {
    response.status(500).send({
      status: 'Failed',
      message: getErrorMessage(error),
    });
  }
}

export { deleteAlertImpl };
