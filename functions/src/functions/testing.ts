// In this file I test anything I would like to check if it works correctly.
// Delete this file when it is unused.

import axios from 'axios';
import * as functions from 'firebase-functions';

import { getErrorMessage } from '../utils/error_message';

const testingImpl = async (request: functions.Request, response: functions.Response) => {
    try {
        const coinIds = ['bitcoin', 'ethereum', 'tether'];
        const coinPrices = await fetchCoinPrices(coinIds);
        const price = coinPrices['bitcoin']['usd'];

        response.status(200).send(
            {
                coinPrices,
                'coinPricesType': typeof coinPrices,
                'bitcoinPrice': price,
                'priceType': typeof price,
            }
        );
    } catch (error) {
        response.status(500).send({
            status: 'Failed',
            message: getErrorMessage(error),
        });
    }
}


const baseUrl = 'https://api.coingecko.com/api/v3/simple/price?';
const currencies = 'usd';

const fetchCoinPrices = async (coinIds: Array<string>) => {
    const formattedCoinIds = coinIds.join(',');
    const url = `${baseUrl}&vs_currencies=${currencies}&ids=${formattedCoinIds}`;
    const response = await axios.get(url);

    return response.status == 200 ? response.data : {};
}

export { testingImpl };
