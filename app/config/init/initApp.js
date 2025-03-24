"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initApp = void 0;
const util_1 = require("util");
const sleep = (0, util_1.promisify)(setTimeout);
const initApp = async (app, mongoose, logger) => {
    await sleep(20); // <= wait for app launch (db, cache...)
    logger.info('### App init Done.');
};
exports.initApp = initApp;
//# sourceMappingURL=initApp.js.map