import {promisify} from 'util';
import {Mongoose} from 'mongoose';
import {ILogger} from 'mle-tools-node';
import {Express} from 'express';

const sleep = promisify(setTimeout);

export const initApp = async (app: Express, mongoose: Mongoose, logger: ILogger) => {

    await sleep(20); // <= wait for app launch (db, cache...)
    logger.info('### App init Done.');
};
