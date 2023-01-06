import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import axios from 'axios';

const checkAlertsImpl = async (context: functions.EventContext) => {
    functions.logger.log('Function is working...');

    const alertsRef = await admin.firestore().collection('alerts');
    const alertsSnapshot = await alertsRef.where('isActive', '==', true).get();

    const coinIds = ['bitcoin', 'ethereum', 'tether'];
    const currentPrices = await fetchCoinPrices(coinIds);

    for (const alert of alertsSnapshot.docs) {
        const { coinId, price, type, userId } = alert.data();
        const currentPrice = currentPrices[coinId]['usd'];

        if (!currentPrice) continue;

        const isPriceAbove = type === 'above' && currentPrice >= price;
        const isPriceBelow = type === 'below' && currentPrice <= price;

        if (isPriceAbove || isPriceBelow) {
            const message = `Coin ${coinId} has reached the target price of ${price}!`;
            functions.logger.log(message);
            await sendPushNotification(userId, message);

        }
    }
};


const baseUrl = 'https://api.coingecko.com/api/v3/simple/price?';
const currencies = 'usd';

const fetchCoinPrices = async (coinIds: Array<string>) => {
    const formattedCoinIds = coinIds.join(',');
    const url = `${baseUrl}&vs_currencies=${currencies}&ids=${formattedCoinIds}`;
    const response = await axios.get(url);

    return response.status == 200 ? response.data : {};
}


function sendPushNotification(userId: string, message: string): Promise<void> {
    // Send a push notification to the user using a service such as Firebase Cloud Messaging or Apple Push Notification Service
    return Promise.resolve();
}

export { checkAlertsImpl };