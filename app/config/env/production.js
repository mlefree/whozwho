"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = void 0;
const _default_1 = require("./_default");
Object.defineProperty(exports, "defaultConfig", { enumerable: true, get: function () { return _default_1.defaultConfig; } });
_default_1.defaultConfig.mongodb.isMocked = true; // => in memory db
_default_1.defaultConfig.cache.uri = ''; // => in memory cache
//# sourceMappingURL=production.js.map