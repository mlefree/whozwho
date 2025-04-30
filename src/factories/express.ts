import express from 'express';
import compression from 'compression';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import {timeTracking, timing} from 'mle-tools-node';
import {whozwhoConfig} from '../config';
import {logger} from './logger';

const _app = express();

export const $express = (async () => {

    logger.info('App trace enabled: ', whozwhoConfig.deploy.isInTraceMode);
    logger.info('App version: ', whozwhoConfig.deploy.env, whozwhoConfig.deploy.version);

    if (whozwhoConfig.deploy.isInTraceMode) {
        const log = {
            stream: {
                write: (message: any) => {
                    return logger.debug('Express debug: ', message);
                },
            },
        };
        _app.use(morgan('tiny', log));
    }

    _app.use(bodyParser.json());
    _app.use(bodyParser.urlencoded({extended: true}));
    _app.use(compression());
    _app.use(timeTracking({milliSecBeforeWarning: 1000})); // use: setMetric(
    _app.use(timing()); // use: res.startTime('file', 'File IO metric'; ...  res.endTime('file';

    if (whozwhoConfig.deploy.version.startsWith('v1.')) {
        const {routes} = require('../config/routes/routes.v1');
        const $routesV1 = await routes(express.Router());
        _app.use($routesV1);
    }

    _app.use((req, res, next) => {
        res.status(404).send();
    });

    logger.info('### App routed.');

    return _app;
})();
