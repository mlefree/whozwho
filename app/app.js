"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$app = void 0;
const util_1 = require("util");
const config_1 = require("./config");
const initApp_1 = require("./config/init/initApp");
const logger_1 = require("./factories/logger");
const express_1 = require("./factories/express");
const mongoose_1 = require("./factories/mongoose");
const sleep = (0, util_1.promisify)(setTimeout);
logger_1.logger.info(`### App ${process.pid} launching...`);
const listen = async () => {
    const mongoose = await mongoose_1.$mongoose;
    const expressApp = await express_1.$express;
    await (0, initApp_1.initApp)(expressApp, mongoose, logger_1.logger);
    if (config_1.config.deploy.isInTestMode) {
        logger_1.logger.warn(`### App warn - Be careful! We are in IS_TESTED’s mode, we do not listen on port. ${config_1.config.deploy.isInTestMode}`);
        return;
    }
    expressApp.listen(config_1.config.deploy.port);
    logger_1.logger.info(`### App ${process.pid} listen on port ${config_1.config.deploy.port}`);
};
exports.$app = (async () => {
    logger_1.logger.info(`### App ${process.pid} should be ready soon...`);
    await sleep(5000); // make sure that DB's started
    const mongoose = await mongoose_1.$mongoose;
    const expressApp = await express_1.$express;
    try {
        const dbUri = config_1.config.getDbUri();
        logger_1.logger.info(`### App mongodb.uri: ${dbUri} - ${config_1.config.deploy.isInTestMode}`);
        if (config_1.config.deploy.isInTraceMode) {
            mongoose.set('debug', (collectionName, method, query, doc) => {
                var _a, _b;
                if (logger_1.logger.getLevel() === logger_1.LoggerLevels.DEBUG) {
                    let queryAsString = (_a = JSON.stringify(method)) === null || _a === void 0 ? void 0 : _a.substring(0, 1000);
                    let docAsString = (_b = JSON.stringify(doc)) === null || _b === void 0 ? void 0 : _b.substring(0, 1000);
                    if ((queryAsString === null || queryAsString === void 0 ? void 0 : queryAsString.length) === 1000) {
                        queryAsString += ' (query too long ...)';
                    }
                    if ((docAsString === null || docAsString === void 0 ? void 0 : docAsString.length) === 1000) {
                        docAsString += ' (doc too long ...)';
                    }
                    logger_1.logger.write(`Mongoose debug : ${collectionName}.${method} : ${queryAsString} - ${docAsString}`);
                }
            });
        }
        const mongoOptions = {
            maxPoolSize: 10, // Maximum number of connections in the pool
            minPoolSize: 5, // Minimum number of connections in the pool
            socketTimeoutMS: 30000 // Maximum wait time for a connection in the queue in milliseconds
        };
        await mongoose.connect(dbUri, mongoOptions);
        logger_1.logger.info(`### App ${process.pid} has been connected`);
        process.on('exit', () => {
            logger_1.logger.info(`### App ${process.pid} has been exited`);
            mongoose.connection.close();
        });
        await listen();
    }
    catch (err) {
        logger_1.logger.error(`### App ${process.pid} Launching Issue : `, err);
        logger_1.logger.error('### Did you launch associated Mongo DB ? ###');
        process.exit(1);
    }
    return expressApp;
})();
//# sourceMappingURL=app.js.map