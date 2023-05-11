import axios from 'axios';
import { requireEnv } from '~/utils/env/env.server';

export function getBingMapsClient() {
    const key = requireEnv('BING_MAPS_KEY');
    const baseURL = 'https://dev.virtualearth.net/REST/v1';
    return axios.create({
        baseURL,
        params: {
            key,
        },
    });
}
