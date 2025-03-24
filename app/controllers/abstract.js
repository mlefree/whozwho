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
        let actorCategory, actorId;
        const host = (request === null || request === void 0 ? void 0 : request.header('Host')) ? request.header('Host') : undefined;
        if (host) {
            try {
                const sepPos = host.indexOf(':');
                if (sepPos === -1) {
                    return { actorCategory: undefined, actorId: undefined };
                }
                actorCategory = host.substring(0, sepPos);
                actorId = parseInt(host.substring(sepPos + 1), 10);
                if (isNaN(actorId)) {
                    return { actorCategory: undefined, actorId: undefined };
                }
            }
            catch (e) {
                logger_1.logger.error('Error parsing host header:', e);
                return { actorCategory: undefined, actorId: undefined };
            }
        }
        return { actorCategory, actorId };
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
        return res.status(404).jsonp({ status: detailsAsString });
    }
    static _badRequest(res, details) {
        const detailsAsString = AbstractController._errorDetails(details);
        logger_1.logger.error('_badRequest: ', detailsAsString);
        return res.status((details === null || details === void 0 ? void 0 : details.code) ? details.code : 400).jsonp({ status: detailsAsString });
    }
    static _internalProblem(res, details) {
        const detailsAsString = AbstractController._errorDetails(details);
        logger_1.logger.error('_internalProblem: ', detailsAsString);
        return res.status((details === null || details === void 0 ? void 0 : details.code) ? details.code : 500).jsonp({ status: detailsAsString.substring(0, 20) + '...' });
    }
    static _notAuthenticated(res, details) {
        const detailsAsString = details || 'not authenticated';
        return res.status((details === null || details === void 0 ? void 0 : details.code) ? details.code : 401).jsonp({ status: detailsAsString });
    }
    static _notAuthorized(res, details) {
        const detailsAsString = details || 'not authorized';
        return res.status((details === null || details === void 0 ? void 0 : details.code) ? details.code : 403).jsonp({ status: detailsAsString });
    }
}
exports.AbstractController = AbstractController;
//# sourceMappingURL=abstract.js.map