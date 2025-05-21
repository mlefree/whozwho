import process from 'node:process';
import {bpInfo} from '../../bpInfo';

export const defaultString = (d: string, v: string) => {
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
        traceConsoleLevel: string,
        traceLogLevel: string
    },
    integration: {
        threadStrategy: string,
        mailUser: string,
        mailPwd: string,
        mailTo: string,
    },
    whozwho: {
        serverUrl: string;
        myUrl: string;
        category: string;
        id: number;
        weight: number;
        alivePeriodInSec: number;
        disabled?: boolean;
    };

    getDbUri: () => string;
}

const dbUri = defaultString(process.env.MONGODB_URI, 'mongodb://127.0.0.1:54306/whozwho');

export const defaultConfig: IConfig = {
    mongodb: {
        uri: dbUri,
        isMocked: (defaultString(process.env.MONGODB_MOCKED, 'false') === 'true'),
        mockedPort: parseInt(defaultString(process.env.MONGODB_MOCKED_PORT, '54303'), 10),
        sandboxData: false,
    },
    cache: {
        uniqueName: 'whozwho-',
        disabled: (defaultString(process.env.REDIS_CACHE_DISABLED, 'false') === 'true'),
        uri: defaultString(process.env.REDIS_URI, ''),
    },
    deploy: {
        port: parseInt(defaultString(process.env.PORT, '3003'), 10),
        env: defaultString(process.env.NODE_ENV, 'development'),
        version: bpInfo.version,
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
    whozwho: {
        disabled: (defaultString(process.env.WHOZWHO_DISABLED, 'false') === 'true'),
        serverUrl: defaultString(process.env.WHOZWHO_SERVER_URL, 'http://localhost:3003'),
        myUrl: defaultString(process.env.WHOZWHO_MY_URL, 'http://localhost:3003'),
        category: defaultString(process.env.WHOZWHO_MY_CATEGORY, 'whozwho'),
        id: parseInt(defaultString(process.env.WHOZWHO_MY_ID, '1'), 10),
        weight: parseInt(defaultString(process.env.WHOZWHO_MY_WEIGHT, '1'), 10),
        alivePeriodInSec: parseInt(defaultString(process.env.WHOZWHO_MY_ALIVE_PERIOD, '60'), 10),
    },

    getDbUri() {
        return dbUri
    }
};

defaultConfig.getDbUri = () => {
    return defaultConfig.mongodb.uri;
}
