import Redis from 'ioredis';
import { requireEnv } from '~/utils/env/env.server';

const redisUrl = requireEnv('REDIS_URL');
export const getRedisInstance = (): Redis => {
    if (!global.__redisClient) {
        global.__redisClient = new Redis(redisUrl);
    }
    return global.__redisClient;
};

export async function readFromCache<T>(key: string) {
    const value = await getRedisInstance().get(key);
    if (!value) {
        throw new Error(`cache.miss`);
    }
    return JSON.parse(value) as T;
}

export async function writeToCache(key: string, value: string, expiration: number) {
    return getRedisInstance().setex(key, expiration, value);
}

export function handleCacheError(e: unknown) {
    if (e instanceof Error && e.message !== 'cache.miss') {
        throw new Error(`Error reading value from cache: ${e.message}`);
    }
}

declare global {
    // This preserves the Redis Client during development
    var __redisClient: Redis | undefined;
}
