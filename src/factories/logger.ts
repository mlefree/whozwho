import {Logger, loggerFactory, LoggerLevels} from 'mle-tools-node';
import {whozwhoConfig} from '../config';

loggerFactory.setUp({
    active: whozwhoConfig.deploy.isInTraceMode,
    consoleLevel: whozwhoConfig.deploy.traceConsoleLevel as LoggerLevels,
    logLevel: whozwhoConfig.deploy.traceLogLevel as LoggerLevels,
    notifyUser: whozwhoConfig.integration.mailUser,
    notifyPwd: whozwhoConfig.integration.mailPwd,
    notifyTo: whozwhoConfig.integration.mailTo,
    filters: [],
});

const logger: Logger = loggerFactory.getLogger();

export {loggerFactory, logger, LoggerLevels};
