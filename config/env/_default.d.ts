import { LoggerLevels } from 'mle-tools-node';
export declare const defaultString: (d: any, v: any) => any;
export declare const defaultArray: (a: any, v: any) => any;
export interface IConfig {
    mongodb: {
        uri: string;
        isMocked: boolean;
        mockedPort?: number;
        sandboxData: boolean;
    };
    cache: {
        uniqueName: string;
        disabled: boolean;
        uri: string;
    };
    deploy: {
        port: number;
        env: string;
        version: string;
        isInTestMode: boolean;
        isInTraceMode: boolean;
        traceConsoleLevel: LoggerLevels;
        traceLogLevel: LoggerLevels;
    };
    integration: {
        threadStrategy: string;
        mailUser: string;
        mailPwd: string;
        mailTo: string;
    };
    getDbUri: () => string;
}
export declare const defaultConfig: IConfig;
