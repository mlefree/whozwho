import {defaultConfig} from './_default';

defaultConfig.mongodb.isMocked = true;          // => in memory db
defaultConfig.cache.uri = '';                   // => in memory cache

export {defaultConfig};
