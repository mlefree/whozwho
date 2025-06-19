import {Logger, loggerFactory, LoggerLevels} from 'mle-tools-node';
import {whozwhoConfig} from '../config';

loggerFactory.setUp(
    whozwhoConfig.deploy.isInTraceMode,
    whozwhoConfig.deploy.traceConsoleLevel as LoggerLevels,
    whozwhoConfig.deploy.traceLogLevel as LoggerLevels,
    whozwhoConfig.integration.mailUser,
    whozwhoConfig.integration.mailPwd,
    whozwhoConfig.integration.mailTo
);

const logger: Logger = loggerFactory.getLogger();

export {loggerFactory, logger, LoggerLevels};
