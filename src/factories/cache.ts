import {CACHE_COUNT, CACHE_STORE, CACHE_TTL, cacheFactory, lru} from 'mle-tools-node';
import {whozwhoConfig} from '../config';
import {Tools} from '../shared/tools';

const cacheType = whozwhoConfig.cache.uri ? CACHE_STORE.REDIS : CACHE_STORE.MEMORY;
const cacheStore = whozwhoConfig.cache.disabled ? CACHE_STORE.NONE : cacheType;

const cacheOptionsLRU = {
    instanceName: whozwhoConfig.cache.uniqueName + Tools.GetHostname(),
    store: cacheStore,
    ttl: CACHE_TTL.TEN_MINUTES,
    max: CACHE_COUNT.LARGE,
    redisUrl: whozwhoConfig.cache.uri
};
const cacheOptionsFast = {
    ...cacheOptionsLRU,
    ttl: 15 * 1000,
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
