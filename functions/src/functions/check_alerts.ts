import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import axios from 'axios';
import { getErrorMessage } from '../utils/error_message';


const checkAlertsImpl = async (context: functions.EventContext) => {
    functions.logger.log('Function is working...');

    const alertsRef = admin.firestore().collection('alerts');
    const alertsSnapshot = await alertsRef.where('isActive', '==', true).get();

    const coinIds = await getSavedCoinIds();
    const currentPrices = await fetchCurrentCoinPrices(coinIds);

    for (const alert of alertsSnapshot.docs) {
        const { coinId, price, type, userId } = alert.data();
        const currentPrice = currentPrices[coinId]['usd'];

        if (!currentPrice) continue;

        const isPriceAboveTarget = type === 'above' && currentPrice >= price;
        const isPriceBelowTarget = type === 'below' && currentPrice <= price;

        if (isPriceAboveTarget || isPriceBelowTarget) {
            const message = `Coin ${coinId} has reached the target price of ${price}!`;

            const token = await getFcmTokenByUserId(userId);
            functions.logger.log('Here is the token');
            functions.logger.log(token);

            sendPushNotification(token);
            
            functions.logger.log(message);
            //TODO: After sending the notifications set isActive to false.
        }
    }
};

const getSavedCoinIds = async (): Promise<Array<string>> => {
    const coinIdsDoc = await admin.firestore().doc('coins/coinIds').get();
    return coinIdsDoc.get('coinIds');
}


const baseUrl = 'https://api.coingecko.com/api/v3/simple/price?';
const currencies = 'usd';

const fetchCurrentCoinPrices = async (coinIds: Array<string>) => {
    const formattedCoinIds = coinIds.join(',');
    const url = `${baseUrl}&vs_currencies=${currencies}&ids=${formattedCoinIds}`;
    const response = await axios.get(url);

    return response.status == 200 ? response.data : {};
}

const getFcmTokenByUserId = async (userId: string): Promise<string> => {
    const usersRef = admin.firestore().collection('users').doc(userId);
    const userSnapshot = await usersRef.get();
    const data = userSnapshot.data();

    return data?.fcmToken;
}

function sendPushNotification(fcmToken: string): Promise<void> {
    if (!fcmToken) return Promise.resolve();

    const message = {
        token: fcmToken,
        data: {
            title: 'Coin Alert',
            body: 'Coin has reached the target price!'
        },
    };

    admin.messaging().send(message)
        .then((response) => {
            functions.logger.log(`Sending alert to this token = ${fcmToken}`);
        })
        .catch((error) => {
            console.log('Error sending message:', getErrorMessage(error));
        });


    return Promise.resolve();
}


export { checkAlertsImpl };