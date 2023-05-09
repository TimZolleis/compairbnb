import Redis from 'ioredis';

export const getRedisInstance = (): Redis => {
    if (!process.env.REDIS_URL) {
        throw new Error('ENV REDIS_URL is required');
    }
    if (!global.__redisClient) {
        global.__redisClient = new Redis(process.env.REDIS_URL);
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

export function globalCache() {
    if (!global.__globalCache) {
        global.__globalCache = new Map();
    }
    return global.__globalCache;
}

declare global {
    // This preserves the Redis Client during development
    var __redisClient: Redis | undefined;
    var __globalCache: Map<string, string>;
}
