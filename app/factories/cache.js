"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheLruLong = exports.cacheOptionsFast = exports.cacheOptionsLRU = exports.cacheLruFast = exports.cacheLru = exports.cacheStore = exports.cacheFactory = void 0;
const mle_tools_node_1 = require("mle-tools-node");
Object.defineProperty(exports, "cacheFactory", { enumerable: true, get: function () { return mle_tools_node_1.cacheFactory; } });
const config_1 = require("../config");
const tools_1 = require("../shared/tools");
const cacheType = config_1.whozwhoConfig.cache.uri ? mle_tools_node_1.CACHE_STORE.REDIS : mle_tools_node_1.CACHE_STORE.MEMORY;
const cacheStore = config_1.whozwhoConfig.cache.disabled ? mle_tools_node_1.CACHE_STORE.NONE : cacheType;
exports.cacheStore = cacheStore;
const cacheOptionsLRU = {
    instanceName: config_1.whozwhoConfig.cache.uniqueName + tools_1.Tools.GetHostname(),
    store: cacheStore,
    ttl: mle_tools_node_1.CACHE_TTL.TEN_MINUTES,
    max: mle_tools_node_1.CACHE_COUNT.LARGE,
    redisUrl: config_1.whozwhoConfig.cache.uri
};
exports.cacheOptionsLRU = cacheOptionsLRU;
const cacheOptionsFast = {
    ...cacheOptionsLRU,
    ttl: 15 * 1000,
};
exports.cacheOptionsFast = cacheOptionsFast;
const cacheOptionsLong = {
    ...cacheOptionsLRU,
    ttl: mle_tools_node_1.CACHE_TTL.DAY
};
// set up
mle_tools_node_1.cacheFactory.setUp(cacheOptionsLong);
const cacheLru = (0, mle_tools_node_1.lru)(cacheOptionsLRU);
exports.cacheLru = cacheLru;
const cacheLruFast = (0, mle_tools_node_1.lru)(cacheOptionsFast);
exports.cacheLruFast = cacheLruFast;
const cacheLruLong = (0, mle_tools_node_1.lru)(cacheOptionsLong);
exports.cacheLruLong = cacheLruLong;
//# sourceMappingURL=cache.js.map