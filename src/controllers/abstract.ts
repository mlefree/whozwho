import {Request, Response} from 'express';
import {$mongoose} from '../factories/mongoose';
import {logger} from '../factories/logger';

export class AbstractController {
    static async _m(modelName: string) {
        const mongoose = await $mongoose;
        return mongoose.model(modelName);
    }

    static _body(request: Request) {
        let body: Record<string, unknown> = request?.body ? request.body : {};
        try {
            if (body?.data) {
                body = body.data as Record<string, unknown>;
            }
            if (typeof body === 'string') {
                body = JSON.parse(body) as Record<string, unknown>;
            }
        } catch (ignored) {
            // Silently ignore JSON parsing errors as we'll use the original body
        }
        return body;
    }

    static _host(request: Request) {
        let actorCategory: string, actorId: number, actorAddress: string;
        const host = request?.header('Host') ? request.header('Host') : undefined;
        const forwarded = request?.header('Forwarded') ? request.header('Forwarded') : undefined;
        // Forwarded: `for=${this.config.whozwho.category};by=${this.config.whozwho.id}`,

        if (host) {
            actorAddress = host;
        }

        if (forwarded) {
            const forwardedItems = forwarded.split(';');
            for (const item of forwardedItems) {
                try {
                    if (item.startsWith('for=')) {
                        actorCategory = item.substring(4);
                    } else if (item.startsWith('by=')) {
                        actorId = parseInt(item.substring(3), 10);
                    }
                } catch (e) {
                    logger.error('Error parsing forwarded header:', e);
                    return {actorCategory: undefined, actorId: undefined, actorAddress: undefined};
                }
            }
        }
        return {actorCategory, actorId, actorAddress};
    }

    static _query(req: Request) {
        return req.query;
    }

    static _errorDetails(details: unknown) {
        let detailsAsString = details ? '' + details : '[no detail]';

        let detailsStack: string | undefined;
        // Type guard to check if details is an object with a stack property
        if (details && typeof details === 'object' && 'stack' in details && details.stack) {
            detailsStack = String(details.stack);
        } else {
            const myObject: {stack?: string} = {};
            Error.captureStackTrace(myObject);
            detailsStack = myObject.stack;
        }

        try {
            const detailsStringified = JSON.stringify(details);
            if (detailsStringified.length > detailsAsString.length) {
                detailsAsString = detailsStringified;
            }
        } catch (ignored) {
            // Silently ignore JSON stringify errors and continue with the original string representation
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
        return res.status(404).jsonp({error: detailsAsString});
    }

    static _badRequest(res: Response, details) {
        const detailsAsString = AbstractController._errorDetails(details);
        logger.error('_badRequest: ', detailsAsString);
        return res.status(details?.code ? details.code : 400).jsonp({error: detailsAsString});
    }

    static _internalProblem(res: Response, details) {
        const detailsAsString = AbstractController._errorDetails(details);
        logger.error('_internalProblem: ', detailsAsString);
        return res
            .status(details?.code ? details.code : 500)
            .jsonp({error: detailsAsString.substring(0, 20) + '...'});
    }

    static _notAuthenticated(res: Response, details) {
        const detailsAsString = details || 'not authenticated';
        return res.status(details?.code ? details.code : 401).jsonp({error: detailsAsString});
    }

    static _notAuthorized(res: Response, details) {
        const detailsAsString = details || 'not authorized';
        return res.status(details?.code ? details.code : 403).jsonp({error: detailsAsString});
    }
}
