import express from 'express';
import compression from 'compression';
import morgan from 'morgan';
import {timeTracking, timing} from 'mle-tools-node';

import {config} from '../config';
import {logger} from './logger';

const _app = express();

export const $express = (async () => {

    logger.info('App trace enabled: ', config.deploy.isInTraceMode);
    logger.info('App version: ', config.deploy.env, config.deploy.version);

    if (config.deploy.isInTraceMode) {
        const log = {
            stream: {
                write: (message: any) => {
                    return logger.debug('Express debug: ', message);
                },
            },
        };
        _app.use(morgan('tiny', log));
    }

    _app.use(compression());
    _app.use(timeTracking({milliSecBeforeWarning: 1000})); // use: setMetric(
    _app.use(timing()); // use: res.startTime('file', 'File IO metric'; ...  res.endTime('file';

    if (config.deploy.version.indexOf('1.') === 0) {
        const {routes} = require('../config/routes/routes.v1');
        const $routesV1 = await routes(express.Router());
        _app.use('/v1', $routesV1);
    }

    _app.use((req, res, next) => {
        res.status(404).send();
    });

    logger.info('### App routed.');

    return _app;
})();
