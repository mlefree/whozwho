export declare const defaultString: (d: string, v: string) => string;
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
        traceConsoleLevel: string;
        traceLogLevel: string;
    };
    integration: {
        threadStrategy: string;
        mailUser: string;
        mailPwd: string;
        mailTo: string;
    };
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
export declare const defaultConfig: IConfig;
