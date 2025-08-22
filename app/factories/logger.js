"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerLevels = exports.logger = exports.loggerFactory = void 0;
const mle_tools_node_1 = require("mle-tools-node");
Object.defineProperty(exports, "loggerFactory", { enumerable: true, get: function () { return mle_tools_node_1.loggerFactory; } });
Object.defineProperty(exports, "LoggerLevels", { enumerable: true, get: function () { return mle_tools_node_1.LoggerLevels; } });
const config_1 = require("../config");
mle_tools_node_1.loggerFactory.setUp({
    label: 'whozwho',
    active: config_1.whozwhoConfig.deploy.isInTraceMode,
    consoleLevel: config_1.whozwhoConfig.deploy.traceConsoleLevel,
    logLevel: config_1.whozwhoConfig.deploy.traceLogLevel,
    notifyUser: config_1.whozwhoConfig.integration.mailUser,
    notifyPwd: config_1.whozwhoConfig.integration.mailPwd,
    notifyTo: config_1.whozwhoConfig.integration.mailTo,
    filters: [],
});
const logger = mle_tools_node_1.loggerFactory.getLogger();
exports.logger = logger;
//# sourceMappingURL=logger.js.map