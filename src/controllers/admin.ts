import {Request, Response} from 'express';
import npmRun from 'npm-run';
import {Whozwho} from 'whozwho-client';
import {logger} from '../factories/logger';
import {config} from '../config';
import {AbstractController} from './abstract';
import {ActorAnswer, ActorQuestion, ActorStatics} from '../models/actor';
import {AdviceModel, AdviceStatics, AdviceType} from '../models/advice';

export class AdminController extends AbstractController {

    static async getStatus(req: Request, res: Response) {
        let status: any = {};
        try {
            const {StatusStatics} = require('../models/status');
            status = await StatusStatics.BuildSummarizedStatus(config.deploy.version);

            if (!config.whozwho.disabled) {
                const whozwho = new Whozwho(config);
                const advices = await whozwho.getAdvices();
                for (const advice of (advices || [])) {
                    if (advice.type === AdviceType.UPDATE) {
                        await whozwho.mentionThatAdviceIsOnGoing(advice);
                        await AdminController.Update();
                        status = {
                            version: status.version,
                            update: 'update is launched...'
                        };
                    }
                }
                status.isPrincipal = await whozwho.isPrincipal();
            }

            status.built = new Date().toISOString();
            if (status.ok || status.update) {
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

    static async postHi(req: Request, res: Response) {
        const {actorCategory, actorId} = AbstractController._host(req);
        const hi: {
            weight: number,
            alivePeriodInSec: number,
            version: string,
            last100Errors: string[]
        } = AbstractController._body(req);
        if (!hi || Object.keys(hi).length !== 4 || !actorCategory || typeof actorId === 'undefined') {
            AbstractController._badRequest(res, 'needs an high five, actor category and id');
            return;
        }

        try {
            await ActorStatics.PushHighFive(actorCategory, actorId, hi);

            await AdviceStatics.FinishPotentialOngoingAdvices(actorCategory, actorId);
        } catch (e) {
            AbstractController._internalProblem(res, e);
            return;
        }

        res.status(204).send();
    }

    static async postActor(req: Request, res: Response) {
        const {actorCategory, actorId} = AbstractController._host(req);
        const body = AbstractController._body(req);
        if (!body?.question || !actorCategory || typeof actorId === 'undefined') {
            AbstractController._badRequest(res, 'needs a question, actor category and id');
            return;
        }

        let answer: ActorAnswer;
        try {

            const question = body.question;
            if (question === ActorQuestion.PRINCIPAL) {
                answer = await ActorStatics.HaveAPrincipalRole(actorCategory, actorId);
            }

        } catch (e) {
            AbstractController._internalProblem(res, e);
            return;
        }

        res.status(200).send({answer});
    }

    static async postAdvice(req: Request, res: Response) {
        const {actorCategory, actorId} = AbstractController._host(req);
        const body = AbstractController._body(req);
        if (!body?.type || !actorCategory || typeof actorId === 'undefined') {
            AbstractController._badRequest(res, 'needs a advice type, actor category and id');
            return;
        }

        let advices: { id: string, type: string }[] = [];
        try {

            const adviceType = body.type;
            if (adviceType === AdviceType.UPDATE) {
                advices = await AdviceStatics.AskToUpdate('admin', 0, body.category);
                if (advices.length === 0) {
                    AbstractController._badRequest(res, 'needs a valid sender and advice');
                    return;
                }
            }

        } catch (e) {
            AbstractController._internalProblem(res, e);
            return;
        }

        res.status(200).send({advices});
    }

    static async loadAdviceId(req: Request, res: Response, next: () => void, _id: string) {
        try {
            req['loadedAdvice'] = await AdviceModel.findById(_id);
            next();
        } catch (err) {
            AbstractController._notFound(res, 'Need a valid adviceId');
        }
    }

    static async putAdvice(req: Request, res: Response) {
        const {actorCategory, actorId} = AbstractController._host(req);
        const body = AbstractController._body(req);
        if (!body?.status || !actorCategory || typeof actorId === 'undefined') {
            AbstractController._badRequest(res, 'needs a advice status, actor category and id');
            return;
        }

        const advice: { id: string, type: string } = {id: 'na', type: 'na'};
        try {
            const adviceFound: any = req['loadedAdvice'];
            advice.id = adviceFound.id;
            advice.type = adviceFound.type;
            adviceFound.status = body.status;
            await adviceFound.save();
        } catch (e) {
            AbstractController._internalProblem(res, e);
            return;
        }

        res.status(200).send({advice});
    }

    static async getAdvices(req: Request, res: Response) {
        const {actorCategory, actorId} = AbstractController._host(req);
        if (!actorCategory || typeof actorId === 'undefined') {
            AbstractController._badRequest(res, 'needs an actor category and id');
            return;
        }

        try {
            const advices: {
                id: string,
                type: string
            }[] = await AdviceStatics.GetTrickyAdvices(actorCategory, actorId);
            if (advices.length === 0) {
                res.status(404).type('application/json').send();
                return;
            }

            res.status(200).type('application/json').send({advices});
        } catch (e) {
            AbstractController._internalProblem(res, e);
        }
    }

    protected static async Update() {
        logger.warn('#UPDATE app with "npm run update"...');
        return 'TODO be careful';

        npmRun.exec('npm run update', {}, async (err, stdout, stderr) => {
            logger.warn(`#UPDATE ${process.pid} update: `, err, stdout, stderr);
            process.exit(0);
        });

    }

}
