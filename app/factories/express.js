"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$express = void 0;
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const mle_tools_node_1 = require("mle-tools-node");
const config_1 = require("../config");
const logger_1 = require("./logger");
const _app = (0, express_1.default)();
exports.$express = (async () => {
    logger_1.logger.info('App trace enabled: ', config_1.whozwhoConfig.deploy.isInTraceMode);
    logger_1.logger.info('App version: ', config_1.whozwhoConfig.deploy.env, config_1.whozwhoConfig.deploy.version);
    if (config_1.whozwhoConfig.deploy.isInTraceMode) {
        const log = {
            stream: {
                write: (message) => {
                    return logger_1.logger.debug('Express debug: ', message);
                },
            },
        };
        _app.use((0, morgan_1.default)('tiny', log));
    }
    _app.use(body_parser_1.default.json({ limit: '10mb' }));
    _app.use(body_parser_1.default.urlencoded({ extended: true, limit: '10mb' }));
    _app.use((0, compression_1.default)());
    _app.use((0, mle_tools_node_1.timeTracking)({ milliSecBeforeWarning: 1000 })); // use: setMetric(
    _app.use((0, mle_tools_node_1.timing)()); // use: res.startTime('file', 'File IO metric'; ...  res.endTime('file';
    if (config_1.whozwhoConfig.deploy.version.startsWith('v1.')) {
        const { routes } = require('../config/routes/routes.v1');
        const $routesV1 = await routes(express_1.default.Router());
        _app.use($routesV1);
    }
    _app.use((req, res, next) => {
        res.status(404).send();
    });
    logger_1.logger.info('### App routed.');
    return _app;
})();
//# sourceMappingURL=express.js.map