import cluster from 'node:cluster';
import worker_threads from 'node:worker_threads';
import {join} from 'node:path';
import {IConfig} from './env/_default';

require('dotenv').config({path: join(__dirname, '../..', '.env')});

let _config: IConfig;

if (process.env.NODE_ENV === 'test') {
    _config = require('./env/test').defaultConfig;
} else if (process.env.NODE_ENV === 'production') {
    _config = require('./env/production').defaultConfig;
} else {
    _config = require('./env/development').defaultConfig;
}

if (cluster.isPrimary && worker_threads.isMainThread && _config.mongodb.isMocked) {
    const {MongoMemoryServer} = require('mongodb-memory-server');
    console.log('### App db to start..');
    const mongoServer = new MongoMemoryServer({instance: {port: _config.mongodb.mockedPort}});
    mongoServer.start().then(() => {
        console.log('### App db started..');
        _config.mongodb.uri = mongoServer.getUri();
        console.log('### App db started', _config.mongodb.uri);
    });
    process.on('exit', async () => {
        console.warn('>>> About to exit.');
        await mongoServer.stop();
    });
}

if (cluster.isPrimary && worker_threads.isMainThread) {
    console.log('### App _configEnv: ', process.env.NODE_ENV,
        JSON.stringify(_config, null, 4));
}

export const config = _config;
