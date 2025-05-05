import {defaultConfig} from './_default';

defaultConfig.mongodb.isMocked = true;          // => in memory db
// defaultConfig.cache.disabled = true;            // => disable all cache
defaultConfig.cache.uri = '';                   // => in memory cache

export {defaultConfig};
