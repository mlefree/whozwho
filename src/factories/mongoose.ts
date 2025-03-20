import {readdirSync} from 'node:fs';
import {join} from 'node:path';
import mongoose, {Mongoose} from 'mongoose';

export const $mongoose = (async (): Promise<Mongoose> => {

    // Bootstrap synchronously models
    const models = join(__dirname, '../models');
    const regex = /.*\.(js|ts)$/;
    readdirSync(models)
        .filter(file => regex.test(file))
        .forEach((file) => {
            if (file.indexOf('.spec') < 0 && file.indexOf('.d.ts') < 0) {
                return require(join(models, file));
            }
        });

    // console.log('mongoose factory:', _mongoose);
    return mongoose;
})();
