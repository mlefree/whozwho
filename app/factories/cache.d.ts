import { CACHE_COUNT, CACHE_STORE, CACHE_TTL, cacheFactory } from 'mle-tools-node';
declare const cacheStore: CACHE_STORE;
declare const cacheOptionsLRU: {
    instanceName: string;
    store: CACHE_STORE;
    ttl: CACHE_TTL;
    max: CACHE_COUNT;
    redisUrl: string;
};
declare const cacheOptionsFast: {
    ttl: number;
    instanceName: string;
    store: CACHE_STORE;
    max: CACHE_COUNT;
    redisUrl: string;
};
declare const cacheLru: (req: any, res: any, next: (err?: any) => void) => Promise<void>;
declare const cacheLruFast: (req: any, res: any, next: (err?: any) => void) => Promise<void>;
declare const cacheLruLong: (req: any, res: any, next: (err?: any) => void) => Promise<void>;
export { cacheFactory, cacheStore, cacheLru, cacheLruFast, cacheOptionsLRU, cacheOptionsFast, cacheLruLong, };
