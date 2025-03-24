import {Logger, loggerFactory, LoggerLevels} from 'mle-tools-node';
import {config} from '../config';

loggerFactory.setUp(
    config.deploy.isInTraceMode,
    config.deploy.traceConsoleLevel as LoggerLevels,
    config.deploy.traceLogLevel as LoggerLevels,
    config.integration.mailUser,
    config.integration.mailPwd,
    config.integration.mailTo,
);

const logger: Logger = loggerFactory.getLogger();

export {loggerFactory, logger, LoggerLevels};
