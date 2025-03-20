import {LoggerLevels} from 'mle-tools-node';
import {join} from 'node:path';

require('dotenv').config({path: join(__dirname, '../../..', '.env')});

export const defaultString = (d, v) => {
    return d ? d : v;
};

export const defaultArray = (a, v) => {
    if (typeof a === 'string') {
        return a ? a.split(',') : v;
    } else if (v) {
        return a ? a : v;
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
    },
    pollers: {
        limit: number,
        confSrc: string,
        conf: string,
        MeteoFrance: {
            token: string,
            url: string,
        },
    },
    whozwho: {
        url: string,
        category: string,
        id: string,
        weight: number
    };

    getDbUri: () => string;
}

const dbUri = defaultString(process.env.MONGODB_URI, 'mongodb://127.0.0.1:54321/raain-ground');

export const defaultConfig: IConfig = {
    mongodb: {
        uri: dbUri,
        isMocked: (defaultString(process.env.MONGODB_MOCKED, 'false') === 'true'),
        mockedPort: parseInt(defaultString(process.env.MONGODB_MOCKED_PORT, '54321'), 10),
        sandboxData: false,
    },
    cache: {
        uniqueName: 'ground-',
        disabled: (defaultString(process.env.REDIS_CACHE_DISABLED, 'false') === 'true'),
        uri: defaultString(process.env.REDIS_URI, ''),
    },
    deploy: {
        port: defaultString(process.env.PORT, 3003),
        env: defaultString(process.env.NODE_ENV, 'development'),
        version: defaultString(require('../../../package.json').version, '0.0.0'),
        isInTestMode: (defaultString(process.env.RAAIN_IS_TESTED, 'false') === 'true'),
        isInTraceMode: (defaultString(process.env.RAAIN_TRACE, 'false') === 'true'),
        traceConsoleLevel: (defaultString(process.env.RAAIN_TRACE_CONSOLE_LEVEL, 'info')),
        traceLogLevel: (defaultString(process.env.RAAIN_TRACE_LOG_LEVEL, 'info'))
    },
    integration: {
        threadStrategy: (defaultString(process.env.THREAD_STRATEGY, 'direct')),
        mailUser: defaultString(process.env.MAIL_USER, ''),
        mailPwd: defaultString(process.env.MAIL_PWD, ''),
        mailTo: defaultString(process.env.MAIL_TO, ''),
    },
    pollers: {
        limit: 20,
        confSrc: '../conf/pollConf.json',
        conf: '../conf/pollConf.gitignored.json',
        MeteoFrance: {
            token: defaultString(process.env.MF_TOKEN, 'xxx'),
            url: defaultString(process.env.MF_API_URI, 'https://public-api.meteofrance.fr/public'),
        }
    },
    whozwho: {
        url: defaultString(process.env.WHOZWHO_URL, 'http://127.0.0.1:3006'),
        category: defaultString(process.env.WHOZWHO_MY_CATEGORY, 'raain-ground'),
        id: defaultString(process.env.WHOZWHO_MY_ID, '1'),
        weight: parseInt(defaultString(process.env.WHOZWHO_MY_WEIGHT, '1'), 10),
    },

    getDbUri() {
        return dbUri
    }
};

defaultConfig.getDbUri = () => {
    return defaultConfig.mongodb.uri;
}
