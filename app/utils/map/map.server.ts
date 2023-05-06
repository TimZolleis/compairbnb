import * as process from 'process';
import axios from 'axios';

export function getBingMapsClient() {
    const key = process.env.BING_MAPS_KEY;
    if (!key) {
        throw new Error('Environment variable required: BING_MAPS_KEY');
    }
    const baseURL = 'https://dev.virtualearth.net/REST/v1';
    return axios.create({
        baseURL,
        params: {
            key,
        },
    });
}
