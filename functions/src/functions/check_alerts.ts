import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import axios from 'axios';

interface StringObject {
    [key: string]: string
}

let tokensCache: StringObject = {};

const checkAlertsImpl = async (context: functions.EventContext) => {
    functions.logger.log('Function is working...');
    functions.logger.log('Tokens cache');
    functions.logger.log(tokensCache);

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
            sendPushNotification(token, message);

            const isTokenCached = userId in tokensCache;
            if (!isTokenCached) tokensCache[userId] = token;

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

const getFcmTokenByUserId = async (id: string): Promise<string> => {
    const isTokenCached = id in tokensCache;
    if (isTokenCached) {
        return tokensCache[id];
    }

    return getFcmTokenFromFirestore(id);
}

const getFcmTokenFromFirestore = async (userId: string): Promise<string> => {
    const usersRef = admin.firestore().collection('users').doc(userId);
    const userSnapshot = await usersRef.get();
    const data = userSnapshot.data();

    return data?.fcmToken;
}

function sendPushNotification(fcmToken: string, message: string): Promise<void> {
    if (!fcmToken) return Promise.resolve();

    functions.logger.log(`Sending alert to this token = ${fcmToken}`);
    return Promise.resolve();
}

export { checkAlertsImpl };