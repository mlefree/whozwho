import {LoggerLevels} from 'mle-tools-node';
import {join} from 'node:path';

require('dotenv').config({path: join(__dirname, '../../..', '.env')});

export const defaultString = (d, v) => {
    return d || v;
};

export const defaultArray = (a, v) => {
    if (typeof a === 'string') {
        return a ? a.split(',') : v;
    } else if (v) {
        return a || v;
    } else {
        return a || [];
    }
};

export interface IConfig {
    mongodb: {
        uri: string,
        isMocked: boolean,
        mockedPort?: number;
        sandboxData: boolean,
    },
    cache: {
        uniqueName: string;
        disabled: boolean,
        uri: string,
    },
    deploy: {
        port: number,
        env: string,
        version: string,
        isInTestMode: boolean,
        isInTraceMode: boolean,
        traceConsoleLevel: LoggerLevels,
        traceLogLevel: LoggerLevels
    },
    integration: {
        threadStrategy: string,
        mailUser: string,
        mailPwd: string,
        mailTo: string,
    };

    getDbUri: () => string;
}

const dbUri = defaultString(process.env.MONGODB_URI, 'mongodb://127.0.0.1:54306/whozwho');

export const defaultConfig: IConfig = {
    mongodb: {
        uri: dbUri,
        isMocked: (defaultString(process.env.MONGODB_MOCKED, 'false') === 'true'),
        mockedPort: parseInt(defaultString(process.env.MONGODB_MOCKED_PORT, '54306'), 10),
        sandboxData: false,
    },
    cache: {
        uniqueName: 'whozwho-',
        disabled: (defaultString(process.env.REDIS_CACHE_DISABLED, 'false') === 'true'),
        uri: defaultString(process.env.REDIS_URI, ''),
    },
    deploy: {
        port: defaultString(process.env.PORT, 3006),
        env: defaultString(process.env.NODE_ENV, 'development'),
        version: defaultString(require('../../../package.json').version, '0.0.0'),
        isInTestMode: (defaultString(process.env.IS_TESTED, 'false') === 'true'),
        isInTraceMode: (defaultString(process.env.TRACE_ENABLED, 'false') === 'true'),
        traceConsoleLevel: (defaultString(process.env.TRACE_CONSOLE_LEVEL, 'info')),
        traceLogLevel: (defaultString(process.env.TRACE_LOG_LEVEL, 'info'))
    },
    integration: {
        threadStrategy: (defaultString(process.env.THREAD_STRATEGY, 'direct')),
        mailUser: defaultString(process.env.MAIL_USER, ''),
        mailPwd: defaultString(process.env.MAIL_PWD, ''),
        mailTo: defaultString(process.env.MAIL_TO, ''),
    },

    getDbUri() {
        return dbUri
    }
};

defaultConfig.getDbUri = () => {
    return defaultConfig.mongodb.uri;
}
