import {promisify} from 'util';
import {Mongoose} from 'mongoose';
import {ILogger} from 'mle-tools-node';
import {Express} from 'express';
import {cpSync} from 'node:fs';
import {join} from 'node:path';
import {config} from '../index';

const sleep = promisify(setTimeout);

export const initApp = async (app: Express, mongoose: Mongoose, logger: ILogger) => {

    cpSync(join(__dirname, '../..', config.pollers.confSrc), join(__dirname, '../..', config.pollers.conf));

    await sleep(20); // <= wait for app launch (db, cache...)
    logger.info('### App init Done.');
};
