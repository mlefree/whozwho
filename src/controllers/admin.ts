import {Request, Response} from 'express';
import path from 'node:path';
import npmRun from 'npm-run';
import {logger} from '../factories/logger';
import {config} from '../config';
import {AbstractController} from './abstract';
import {PollConfiguration, ProviderName, StoreDirectories} from 'raain-data-tools';
import {launcher} from '../factories/launcher';
import {Advice, Whozwho} from '../shared/whozwho';

export class AdminController extends AbstractController {

    static async getStatus(req: Request, res: Response) {
        let status: any = {};
        try {
            const {StatusStatics} = require('../models/status');
            status = await StatusStatics.BuildSummarizedStatus(config.deploy.version);

            const advice = await Whozwho.GetAdvice();
            if (advice === Advice.UPDATE) {
                await AdminController.Update();
                status.update = 'update is ongoing...'
                res.status(200).jsonp(status);
                return;
            }

            const isPrincipal = await Whozwho.IsPrincipal();
            if (isPrincipal) {
                AdminController.CheckPolling().then(ignored => {
                });
            }
            status.isPrincipal = isPrincipal;

            if (status.ok) {
                res.status(200).jsonp(status);
                return;
            }

            logger.error('bad status:', JSON.stringify(status, null, 2));
        } catch (e) {
            AbstractController._internalProblem(res, e);
            return;
        }

        res.status(206).send(status);
    }

    static async postPoll(req: Request, res: Response) {
        try {
            const polled = await AdminController.CheckPolling();
            res.status(200).jsonp({polled});
        } catch (e) {
            AbstractController._internalProblem(res, e);
        }
    }

    static async postUpdate(req: Request, res: Response) {
        logger.warn('#UPDATE update...');
        const version = require(path.resolve(__dirname, '../../package.json')).version;
        await AdminController.Update()
        res.status(200).send('update raain-ground from version: ' + version + ' to HEAD ...');
    }

    protected static async Update() {
        logger.warn('#UPDATE app with "npm run update"...');
        npmRun.exec('npm run update', {}, async (err, stdout, stderr) => {
            logger.warn(`#UPDATE ${process.pid} update: `, err, stdout, stderr);
            process.exit(0);
        });

    }

    protected static async CheckPolling() {

        const pollConf = PollConfiguration.CreateFromFile(path.join(__dirname, '..', config.pollers.conf));
        const pollConfigurationProviders = pollConf.getAllProviders();

        const pollStorePath = path.join(__dirname, '../..', 'store.gitignored');
        for (const provider of Object.keys(ProviderName)) {
            const store = new StoreDirectories(pollStorePath, ProviderName[provider], console);
            store.clean({all: true});
        }

        // => Split and Launch providers polling (PollConfigurationProvider[])
        let launched = 0;
        for (const pollConfigurationProvider of pollConfigurationProviders) {

            const pollKey = pollConf.getProviderKey(pollConfigurationProvider);
            const isReady = PollConfiguration.IsProviderReadyToPoll(pollConfigurationProvider);
            if (isReady && launched < config.pollers.limit) {
                // => Launch Poll worker
                launched++;
                logger.info(`${pollKey} isReady => Launch Poll worker ${launched}`);
                const {WorkerNames} = require('../workers/workerProcessor');

                const workerData = {
                    config: {},
                    input: {
                        pollStorePath,
                        pollKey,
                        pollConfigurationProvider: JSON.stringify(pollConfigurationProvider),
                    },
                };
                await launcher.push([WorkerNames.poll], workerData);
            }
        }

        return launched;
    }

}
