import {defaultConfig} from './_default';

defaultConfig.deploy.isInTestMode = true;       // => disable server port listener
defaultConfig.mongodb.isMocked = true;          // => in memory db (do not need started mongo anymore)
defaultConfig.mongodb.sandboxData = true;       // => add sandbox data at startup (useless for now)
defaultConfig.cache.disabled = true;            // => disable all cache
defaultConfig.whozwho.disabled = true;          // => disable whozwho calls

export {defaultConfig};
