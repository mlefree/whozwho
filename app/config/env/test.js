"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = void 0;
const _default_1 = require("./_default");
Object.defineProperty(exports, "defaultConfig", { enumerable: true, get: function () { return _default_1.defaultConfig; } });
_default_1.defaultConfig.deploy.isInTestMode = true; // => disable server port listener
_default_1.defaultConfig.mongodb.isMocked = true; // => in memory db (do not need started mongo anymore)
_default_1.defaultConfig.mongodb.sandboxData = true; // => add sandbox data at startup
_default_1.defaultConfig.cache.disabled = true; // => disable all cache
//# sourceMappingURL=test.js.map