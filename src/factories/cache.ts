import {CACHE_COUNT, CACHE_STORE, CACHE_TTL, cacheFactory, lru} from 'mle-tools-node';
import {config} from '../config';
import {Tools} from '../shared/tools';

const cacheType = config.cache.uri ? CACHE_STORE.REDIS : CACHE_STORE.MEMORY;
const cacheStore = config.cache.disabled ? CACHE_STORE.NONE : cacheType;

const cacheOptionsLRU = {
    instanceName: config.cache.uniqueName + Tools.GetHostname(),
    store: cacheStore,
    ttl: CACHE_TTL.TEN_MINUTES,
    max: CACHE_COUNT.LARGE,
    redisUrl: config.cache.uri
};
const cacheOptionsFast = {
    ...cacheOptionsLRU,
    ttl: CACHE_TTL.MINUTE,
};
const cacheOptionsLong = {
    ...cacheOptionsLRU,
    ttl: CACHE_TTL.DAY
};

// set up
cacheFactory.setUp(cacheOptionsLong);
const cacheLru = lru(cacheOptionsLRU);
const cacheLruFast = lru(cacheOptionsFast);
const cacheLruLong = lru(cacheOptionsLong);

export {cacheFactory, cacheStore, cacheLru, cacheLruFast, cacheOptionsLRU, cacheOptionsFast, cacheLruLong};
