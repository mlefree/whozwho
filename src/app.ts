import {promisify} from 'util';
import {whozwhoConfig} from './config';
import {initApp} from './config/init/initApp';
import {logger, LoggerLevels} from './factories/logger';
import {$express} from './factories/express';
import {$mongoose} from './factories/mongoose';

const sleep = promisify(setTimeout);

logger.info(`### App ${process.pid} launching...`);

const listen = async () => {
    const mongoose = await $mongoose;
    const expressApp = await $express;

    await initApp(expressApp, mongoose, logger);

    if (whozwhoConfig.deploy.isInTestMode) {
        logger.warn(
            `### App warn - Be careful! We are in IS_TESTED’s mode, we do not listen on port. ${whozwhoConfig.deploy.isInTestMode}`
        );
        return;
    }
    expressApp.listen(whozwhoConfig.deploy.port);
    logger.info(`### App ${process.pid} listen on port ${whozwhoConfig.deploy.port}`);
};

export const $app = (async () => {
    logger.info(`### App ${process.pid} should be ready soon...`);

    await sleep(5000); // make sure that DB's started
    const mongoose = await $mongoose;
    const expressApp = await $express;
    try {
        const dbUri = whozwhoConfig.getDbUri();
        logger.info(`### App mongodb.uri: ${dbUri} - ${whozwhoConfig.deploy.isInTestMode}`);

        if (whozwhoConfig.deploy.isInTraceMode) {
            mongoose.set('debug', (collectionName, method, query, doc) => {
                if (logger.getLevel() === LoggerLevels.DEBUG) {
                    let queryAsString = JSON.stringify(method)?.substring(0, 1000);
                    let docAsString = JSON.stringify(doc)?.substring(0, 1000);
                    if (queryAsString?.length === 1000) {
                        queryAsString += ' (query too long ...)';
                    }
                    if (docAsString?.length === 1000) {
                        docAsString += ' (doc too long ...)';
                    }
                    logger.write(
                        `Mongoose debug : ${collectionName}.${method} : ${queryAsString} - ${docAsString}`
                    );
                }
            });
        }

        const mongoOptions = {
            maxPoolSize: 10, // Maximum number of connections in the pool
            minPoolSize: 5, // Minimum number of connections in the pool
            socketTimeoutMS: 30000, // Maximum wait time for a connection in the queue in milliseconds
        };
        await mongoose.connect(dbUri, mongoOptions);
        logger.info(`### App ${process.pid} has been connected`);

        process.on('exit', () => {
            logger.info(`### App ${process.pid} has been exited`);
            mongoose.connection.close();
        });

        await listen();
    } catch (err) {
        logger.error(`### App ${process.pid} Launching Issue : `, err);
        logger.error('### Did you launch associated Mongo DB ? ###');
        process.exit(1);
    }
    return expressApp;
})();
