import {Request, Response} from 'express';
import {$mongoose} from '../factories/mongoose';
import {logger} from '../factories/logger';

export class AbstractController {

    static async _m(modelName: string) {
        const mongoose = await $mongoose;
        return mongoose.model(modelName);
    }

    static _body(request: Request) {
        let body: any = request?.body ? request.body : {};
        try {
            if (body?.data) {
                body = body.data;
            }
            body = JSON.parse(body);
        } catch (ignored) {
        }
        return body;
    }

    static _host(request: Request) {
        let actorCategory: string, actorId: number;
        const host = request?.header('Host') ? request.header('Host') : undefined;
        if (host) {
            try {
                const sepPos = host.indexOf(':');
                if (sepPos === -1) {
                    return {actorCategory: undefined, actorId: undefined};
                }
                actorCategory = host.substring(0, sepPos);
                actorId = parseInt(host.substring(sepPos + 1), 10);
                if (isNaN(actorId)) {
                    return {actorCategory: undefined, actorId: undefined};
                }
            } catch (e) {
                logger.error('Error parsing host header:', e);
                return {actorCategory: undefined, actorId: undefined};
            }
        }
        return {actorCategory, actorId};
    }

    static _query(req: Request) {
        return req.query;
    }

    static _errorDetails(details: any) {
        let detailsAsString = details ? '' + details : '[no detail]';

        let detailsStack: any;
        if (details?.stack) {
            detailsStack = details.stack.toString();
        } else {
            const myObject: any = {};
            Error.captureStackTrace(myObject);
            detailsStack = myObject.stack?.toString();
        }

        try {
            const detailsStringified = JSON.stringify(details);
            if (detailsStringified.length > detailsAsString.length) {
                detailsAsString = detailsStringified;
            }
        } catch (ignored) {
        }

        detailsAsString = detailsAsString.substring(0, 1000);
        if (detailsAsString.length === 1000) {
            detailsAsString += ' (too long ...)';
        }

        if (detailsStack) {
            detailsAsString += ' >> stack : ' + detailsStack;
        }

        return detailsAsString;
    }

    static _notFound(res: Response, details) {
        const detailsAsString = AbstractController._errorDetails(details);
        logger.debug('_notFound: ', detailsAsString);
        return res.status(404).jsonp({status: detailsAsString});
    }

    static _badRequest(res: Response, details) {
        const detailsAsString = AbstractController._errorDetails(details);
        logger.error('_badRequest: ', detailsAsString);
        return res.status(details?.code ? details.code : 400).jsonp({status: detailsAsString});
    }

    static _internalProblem(res: Response, details) {
        const detailsAsString = AbstractController._errorDetails(details);
        logger.error('_internalProblem: ', detailsAsString);
        return res.status(details?.code ? details.code : 500).jsonp({status: detailsAsString.substring(0, 20) + '...'});
    }

    static _notAuthenticated(res: Response, details) {
        const detailsAsString = details || 'not authenticated';
        return res.status(details?.code ? details.code : 401).jsonp({status: detailsAsString});
    }

    static _notAuthorized(res: Response, details) {
        const detailsAsString = details || 'not authorized';
        return res.status(details?.code ? details.code : 403).jsonp({status: detailsAsString});
    }

}
