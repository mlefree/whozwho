import {Request, Response} from 'express';
import npmRun from 'npm-run';
import {Whozwho} from 'whozwho-client';
import {logger} from '../factories/logger';
import {whozwhoConfig} from '../config';
import {AbstractController} from './abstract';
import {ActorQuestion, ActorStatics} from '../models/actor';
import {AdviceModel, AdviceStatics, AdviceType} from '../models/advice';
import {join} from 'node:path';

export class AdminController extends AbstractController {
    static async getStatus(req: Request, res: Response) {
        let status: Record<string, unknown> = {};
        try {
            const {StatusStatics} = require('../models/status');
            status = await StatusStatics.BuildSummarizedStatus(whozwhoConfig.deploy.version);

            if (!whozwhoConfig.whozwho.disabled) {
                const parentPath = join(__dirname, '/../../');
                const lastLogs = logger.readLastLogs(parentPath);
                const whozwho = new Whozwho(whozwhoConfig);
                const advices = await whozwho.getAdvices(lastLogs);
                for (const advice of advices || []) {
                    if (advice.type === AdviceType.UPDATE) {
                        const IAmTheLastToBeUpdated = (await AdviceStatics.toDoAdvicesCount()) <= 1;
                        if (IAmTheLastToBeUpdated) {
                            await whozwho.mentionThatAdviceIsOnGoing(advice);
                            await AdminController.Update();
                            status = {
                                version: status.version,
                                update: 'update is launched...',
                            };
                        }
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

        res.status(206).jsonp(status);
    }

    static async postHi(req: Request, res: Response) {
        const {actorCategory, actorId, actorAddress} = AbstractController._host(req);
        const body = AbstractController._body(req);

        if (
            Object.keys(body).length !== 4 ||
            !actorCategory ||
            typeof actorId === 'undefined' ||
            typeof actorAddress === 'undefined'
        ) {
            AbstractController._badRequest(
                res,
                'needs a valid high five, actor category, id and address'
            );
            return;
        }

        try {
            const hi = {
                weight: Number(body.weight),
                alivePeriodInSec: Number(body.alivePeriodInSec),
                version: String(body.version),
                last100Errors: Array.isArray(body.last100Errors)
                    ? body.last100Errors.map(String)
                    : [],
            };

            await ActorStatics.PushHighFive(actorCategory, actorId, actorAddress, hi);

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
        if (!body?.question) {
            AbstractController._badRequest(res, 'needs a question');
            return;
        }

        let answer: boolean | Record<number, string> | undefined;
        try {
            const question = body.question;
            if (question === ActorQuestion.PRINCIPAL) {
                if (!actorCategory || typeof actorId === 'undefined') {
                    AbstractController._badRequest(res, 'needs an actor category and id');
                    return;
                }
                answer = await ActorStatics.HaveAPrincipalRole(actorCategory, actorId);
            } else if (question === ActorQuestion.ADDRESS_ALL) {
                if (!body.category) {
                    AbstractController._badRequest(res, 'needs an actor category');
                    return;
                }
                const actors = await ActorStatics.GetAllActorsFromCategorySortedByWeight(
                    String(body.category)
                );

                answer = {};
                for (const actor of actors) {
                    answer[actor.actorId] = actor.actorAddress;
                }
            } else if (question === ActorQuestion.ADDRESS_PRINCIPAL) {
                if (!body.category) {
                    AbstractController._badRequest(res, 'needs an actor category');
                    return;
                }
                const actor = await ActorStatics.GetPrincipalActorFromCategory(
                    String(body.category)
                );

                answer = {};
                if (actor) {
                    answer[actor.actorId] = actor.actorAddress;
                }
            } else {
                AbstractController._badRequest(res, 'needs a relevant question');
                return;
            }
        } catch (e) {
            AbstractController._internalProblem(res, e);
            return;
        }

        res.status(200).jsonp({answer});
    }

    static async postAdvice(req: Request, res: Response) {
        const {actorCategory, actorId} = AbstractController._host(req);
        const body = AbstractController._body(req);
        if (!body?.type || !actorCategory || typeof actorId === 'undefined') {
            AbstractController._badRequest(res, 'needs a advice type, actor category and id');
            return;
        }

        let advices: {id: string; type: string}[] = [];
        try {
            const adviceType = body.type;
            if (adviceType === AdviceType.UPDATE) {
                advices = await AdviceStatics.AskToUpdate(
                    'admin',
                    -1,
                    body.category ? String(body.category) : undefined
                );
                if (advices.length === 0) {
                    AbstractController._badRequest(res, 'needs a valid sender and advice');
                    return;
                }
            } else {
                AbstractController._badRequest(res, 'needs a valid advice');
                return;
            }
        } catch (e) {
            AbstractController._internalProblem(res, e);
            return;
        }

        res.status(200).jsonp({advices});
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

        const advice: {id: string; type: string} = {id: 'na', type: 'na'};
        try {
            const adviceFound: {
                id: string;
                type: string;
                status: string;
                save: () => Promise<void>;
            } = req['loadedAdvice'];
            advice.id = adviceFound.id;
            advice.type = adviceFound.type;
            adviceFound.status = String(body.status);
            await adviceFound.save();
        } catch (e) {
            AbstractController._internalProblem(res, e);
            return;
        }

        res.status(200).jsonp({advice});
    }

    static async getAdvices(req: Request, res: Response) {
        const {actorCategory, actorId} = AbstractController._host(req);
        if (!actorCategory || typeof actorId === 'undefined') {
            AbstractController._badRequest(res, 'needs an actor category and id');
            return;
        }

        try {
            const advices: {
                id: string;
                type: string;
            }[] = await AdviceStatics.GetTrickyAdvices(actorCategory, actorId);
            if (advices.length === 0) {
                res.status(404).type('application/json').send();
                return;
            }

            res.status(200).type('application/json').jsonp({advices});
        } catch (e) {
            AbstractController._internalProblem(res, e);
        }
    }

    static async getActors(req: Request, res: Response) {
        try {
            // Extract query parameters
            const categoryFilter = req.query.category as string;
            const isPrincipal = req.query.principal === 'true';

            // Array to store all alive actors
            let allAliveActors: {
                actorCategory: string;
                actorId: number;
                actorAddress?: string;
                weight: number;
                alivePeriodInSec: number;
                isPrincipal: boolean;
                version?: string;
                last100Errors?: string[];
                createdAt?: Date;
            }[] = [];

            // If category is specified
            if (categoryFilter) {
                if (isPrincipal) {
                    // Get principal actor from the specified category
                    const principalActor =
                        await ActorStatics.GetPrincipalActorFromCategory(categoryFilter);
                    if (principalActor) {
                        allAliveActors = [principalActor];
                    }
                } else {
                    // Get all alive actors from the specified category
                    allAliveActors =
                        await ActorStatics.GetAllActorsFromCategorySortedByWeight(categoryFilter);
                }
            } else {
                // Get all actor categories
                const categories = await ActorStatics.GetAllCategories();

                // For each category, get all alive actors
                for (const category of categories) {
                    const actorsInCategory =
                        await ActorStatics.GetAllActorsFromCategorySortedByWeight(category);
                    allAliveActors = allAliveActors.concat(actorsInCategory);
                }
            }

            // Return the actors in the expected format
            res.status(200).type('application/json').jsonp({actors: allAliveActors});
        } catch (e) {
            AbstractController._internalProblem(res, e);
        }
    }

    protected static async Update() {
        logger.warn(
            `#UPDATE app with "npm run update" (bypass ? ${whozwhoConfig.deploy.bypassUpdate}) ...`
        );
        if (whozwhoConfig.deploy.bypassUpdate) {
            logger.warn(`#UPDATE ${process.pid} update bypassed...`);
            return;
        }

        npmRun.exec('npm run update', {}, async (err, stdout, stderr) => {
            logger.warn(`#UPDATE ${process.pid} update: `, err, stdout, stderr);
            process.exit(0);
        });
    }
}
