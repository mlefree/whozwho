"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerLevels = exports.logger = exports.loggerFactory = void 0;
const mle_tools_node_1 = require("mle-tools-node");
Object.defineProperty(exports, "loggerFactory", { enumerable: true, get: function () { return mle_tools_node_1.loggerFactory; } });
Object.defineProperty(exports, "LoggerLevels", { enumerable: true, get: function () { return mle_tools_node_1.LoggerLevels; } });
const config_1 = require("../config");
mle_tools_node_1.loggerFactory.setUp(config_1.config.deploy.isInTraceMode, config_1.config.deploy.traceConsoleLevel, config_1.config.deploy.traceLogLevel, config_1.config.integration.mailUser, config_1.config.integration.mailPwd, config_1.config.integration.mailTo);
const logger = mle_tools_node_1.loggerFactory.getLogger();
exports.logger = logger;
//# sourceMappingURL=logger.js.map