"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractController = void 0;
const mongoose_1 = require("../factories/mongoose");
const logger_1 = require("../factories/logger");
class AbstractController {
    static async _m(modelName) {
        const mongoose = await mongoose_1.$mongoose;
        return mongoose.model(modelName);
    }
    static _body(request) {
        let body = (request === null || request === void 0 ? void 0 : request.body) ? request.body : {};
        try {
            if (body === null || body === void 0 ? void 0 : body.data) {
                body = body.data;
            }
            body = JSON.parse(body);
        }
        catch (ignored) {
        }
        return body;
    }
    static _host(request) {
        let actorCategory, actorId, actorAddress;
        const host = (request === null || request === void 0 ? void 0 : request.header('Host')) ? request.header('Host') : undefined;
        const forwarded = (request === null || request === void 0 ? void 0 : request.header('Forwarded')) ? request.header('Forwarded') : undefined;
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
                    }
                    else if (item.startsWith('by=')) {
                        actorId = parseInt(item.substring(3), 10);
                    }
                }
                catch (e) {
                    logger_1.logger.error('Error parsing forwarded header:', e);
                    return { actorCategory: undefined, actorId: undefined, actorAddress: undefined };
                }
            }
        }
        return { actorCategory, actorId, actorAddress };
    }
    static _query(req) {
        return req.query;
    }
    static _errorDetails(details) {
        var _a;
        let detailsAsString = details ? '' + details : '[no detail]';
        let detailsStack;
        if (details === null || details === void 0 ? void 0 : details.stack) {
            detailsStack = details.stack.toString();
        }
        else {
            const myObject = {};
            Error.captureStackTrace(myObject);
            detailsStack = (_a = myObject.stack) === null || _a === void 0 ? void 0 : _a.toString();
        }
        try {
            const detailsStringified = JSON.stringify(details);
            if (detailsStringified.length > detailsAsString.length) {
                detailsAsString = detailsStringified;
            }
        }
        catch (ignored) {
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
    static _notFound(res, details) {
        const detailsAsString = AbstractController._errorDetails(details);
        logger_1.logger.debug('_notFound: ', detailsAsString);
        return res.status(404).jsonp({ error: detailsAsString });
    }
    static _badRequest(res, details) {
        const detailsAsString = AbstractController._errorDetails(details);
        logger_1.logger.error('_badRequest: ', detailsAsString);
        return res.status((details === null || details === void 0 ? void 0 : details.code) ? details.code : 400).jsonp({ error: detailsAsString });
    }
    static _internalProblem(res, details) {
        const detailsAsString = AbstractController._errorDetails(details);
        logger_1.logger.error('_internalProblem: ', detailsAsString);
        return res.status((details === null || details === void 0 ? void 0 : details.code) ? details.code : 500).jsonp({ error: detailsAsString.substring(0, 20) + '...' });
    }
    static _notAuthenticated(res, details) {
        const detailsAsString = details || 'not authenticated';
        return res.status((details === null || details === void 0 ? void 0 : details.code) ? details.code : 401).jsonp({ error: detailsAsString });
    }
    static _notAuthorized(res, details) {
        const detailsAsString = details || 'not authorized';
        return res.status((details === null || details === void 0 ? void 0 : details.code) ? details.code : 403).jsonp({ error: detailsAsString });
    }
}
exports.AbstractController = AbstractController;
//# sourceMappingURL=abstract.js.map