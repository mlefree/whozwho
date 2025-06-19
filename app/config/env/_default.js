"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = exports.defaultArray = exports.defaultString = void 0;
const node_process_1 = __importDefault(require("node:process"));
const bpInfo_1 = require("../../bpInfo");
const defaultString = (d, v) => {
    return d || v;
};
exports.defaultString = defaultString;
const defaultArray = (a, v) => {
    if (typeof a === 'string') {
        return a ? a.split(',') : v;
    }
    else if (v) {
        return a || v;
    }
    else {
        return a || [];
    }
};
exports.defaultArray = defaultArray;
const dbUri = (0, exports.defaultString)(node_process_1.default.env.MONGODB_URI, 'mongodb://127.0.0.1:54303/whozwho');
exports.defaultConfig = {
    mongodb: {
        uri: dbUri,
        isMocked: (0, exports.defaultString)(node_process_1.default.env.MONGODB_MOCKED, 'false') === 'true',
        mockedPort: parseInt((0, exports.defaultString)(node_process_1.default.env.MONGODB_MOCKED_PORT, '54303'), 10),
        sandboxData: false,
    },
    cache: {
        uniqueName: 'whozwho-',
        disabled: (0, exports.defaultString)(node_process_1.default.env.REDIS_CACHE_DISABLED, 'false') === 'true',
        uri: (0, exports.defaultString)(node_process_1.default.env.REDIS_URI, ''),
    },
    deploy: {
        port: parseInt((0, exports.defaultString)(node_process_1.default.env.PORT, '3003'), 10),
        env: (0, exports.defaultString)(node_process_1.default.env.NODE_ENV, 'development'),
        version: bpInfo_1.bpInfo.version,
        isInTestMode: (0, exports.defaultString)(node_process_1.default.env.IS_TESTED, 'false') === 'true',
        isInTraceMode: (0, exports.defaultString)(node_process_1.default.env.TRACE_ENABLED, 'false') === 'true',
        traceConsoleLevel: (0, exports.defaultString)(node_process_1.default.env.TRACE_CONSOLE_LEVEL, 'info'),
        traceLogLevel: (0, exports.defaultString)(node_process_1.default.env.TRACE_LOG_LEVEL, 'info'),
        bypassUpdate: (0, exports.defaultString)(node_process_1.default.env.BYPASS_UPDATE, 'true') === 'true',
    },
    integration: {
        threadStrategy: (0, exports.defaultString)(node_process_1.default.env.THREAD_STRATEGY, 'direct'),
        mailUser: (0, exports.defaultString)(node_process_1.default.env.MAIL_USER, ''),
        mailPwd: (0, exports.defaultString)(node_process_1.default.env.MAIL_PWD, ''),
        mailTo: (0, exports.defaultString)(node_process_1.default.env.MAIL_TO, ''),
    },
    whozwho: {
        disabled: (0, exports.defaultString)(node_process_1.default.env.WHOZWHO_DISABLED, 'false') === 'true',
        serverUrl: (0, exports.defaultString)(node_process_1.default.env.WHOZWHO_SERVER_URL, 'http://localhost:3003'),
        myUrl: (0, exports.defaultString)(node_process_1.default.env.WHOZWHO_MY_URL, 'http://localhost:3003'),
        category: (0, exports.defaultString)(node_process_1.default.env.WHOZWHO_MY_CATEGORY, 'whozwho'),
        id: parseInt((0, exports.defaultString)(node_process_1.default.env.WHOZWHO_MY_ID, '1'), 10),
        weight: parseInt((0, exports.defaultString)(node_process_1.default.env.WHOZWHO_MY_WEIGHT, '1'), 10),
        alivePeriodInSec: parseInt((0, exports.defaultString)(node_process_1.default.env.WHOZWHO_MY_ALIVE_PERIOD, '60'), 10),
    },
    getDbUri() {
        return dbUri;
    },
};
exports.defaultConfig.getDbUri = () => {
    return exports.defaultConfig.mongodb.uri;
};
//# sourceMappingURL=_default.js.map