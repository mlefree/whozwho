"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = exports.defaultArray = exports.defaultString = void 0;
const node_path_1 = require("node:path");
require('dotenv').config({ path: (0, node_path_1.join)(__dirname, '../../..', '.env') });
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
const dbUri = (0, exports.defaultString)(process.env.MONGODB_URI, 'mongodb://127.0.0.1:54306/whozwho');
exports.defaultConfig = {
    mongodb: {
        uri: dbUri,
        isMocked: ((0, exports.defaultString)(process.env.MONGODB_MOCKED, 'false') === 'true'),
        mockedPort: parseInt((0, exports.defaultString)(process.env.MONGODB_MOCKED_PORT, '54306'), 10),
        sandboxData: false,
    },
    cache: {
        uniqueName: 'whozwho-',
        disabled: ((0, exports.defaultString)(process.env.REDIS_CACHE_DISABLED, 'false') === 'true'),
        uri: (0, exports.defaultString)(process.env.REDIS_URI, ''),
    },
    deploy: {
        port: (0, exports.defaultString)(process.env.PORT, 3006),
        env: (0, exports.defaultString)(process.env.NODE_ENV, 'development'),
        version: (0, exports.defaultString)(require('../../../package.json').version, '0.0.0'),
        isInTestMode: ((0, exports.defaultString)(process.env.IS_TESTED, 'false') === 'true'),
        isInTraceMode: ((0, exports.defaultString)(process.env.TRACE_ENABLED, 'false') === 'true'),
        traceConsoleLevel: ((0, exports.defaultString)(process.env.TRACE_CONSOLE_LEVEL, 'info')),
        traceLogLevel: ((0, exports.defaultString)(process.env.TRACE_LOG_LEVEL, 'info'))
    },
    integration: {
        threadStrategy: ((0, exports.defaultString)(process.env.THREAD_STRATEGY, 'direct')),
        mailUser: (0, exports.defaultString)(process.env.MAIL_USER, ''),
        mailPwd: (0, exports.defaultString)(process.env.MAIL_PWD, ''),
        mailTo: (0, exports.defaultString)(process.env.MAIL_TO, ''),
    },
    getDbUri() {
        return dbUri;
    }
};
exports.defaultConfig.getDbUri = () => {
    return exports.defaultConfig.mongodb.uri;
};
//# sourceMappingURL=_default.js.map