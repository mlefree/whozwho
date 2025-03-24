"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const npm_run_1 = __importDefault(require("npm-run"));
const logger_1 = require("../factories/logger");
const config_1 = require("../config");
const abstract_1 = require("./abstract");
const actor_1 = require("../models/actor");
const advice_1 = require("../models/advice");
class AdminController extends abstract_1.AbstractController {
    static async getStatus(req, res) {
        let status = {};
        try {
            const { StatusStatics } = require('../models/status');
            status = await StatusStatics.BuildSummarizedStatus(config_1.config.deploy.version);
            if (status.ok) {
                res.status(200).jsonp(status);
                return;
            }
            logger_1.logger.error('bad status:', JSON.stringify(status, null, 2));
        }
        catch (e) {
            abstract_1.AbstractController._internalProblem(res, e);
            return;
        }
        res.status(206).send(status);
    }
    static async postHi(req, res) {
        const { actorCategory, actorId } = abstract_1.AbstractController._host(req);
        const hi = abstract_1.AbstractController._body(req);
        if (!hi || Object.keys(hi).length !== 4 || !actorCategory || typeof actorId === 'undefined') {
            abstract_1.AbstractController._badRequest(res, 'needs an high five, actor category and id');
            return;
        }
        try {
            await actor_1.ActorStatics.PushHighFive(actorCategory, actorId, hi);
            await advice_1.AdviceStatics.FinishPotentialOngoingAdvices(actorCategory, actorId);
        }
        catch (e) {
            abstract_1.AbstractController._internalProblem(res, e);
            return;
        }
        res.status(204).send();
    }
    static async postActor(req, res) {
        const { actorCategory, actorId } = abstract_1.AbstractController._host(req);
        const body = abstract_1.AbstractController._body(req);
        if (!(body === null || body === void 0 ? void 0 : body.question) || !actorCategory || typeof actorId === 'undefined') {
            abstract_1.AbstractController._badRequest(res, 'needs a question, actor category and id');
            return;
        }
        let answer;
        try {
            const question = body.question;
            if (question === actor_1.ActorQuestion.PRINCIPAL) {
                answer = await actor_1.ActorStatics.HaveAPrincipalRole(actorCategory, actorId);
            }
        }
        catch (e) {
            abstract_1.AbstractController._internalProblem(res, e);
            return;
        }
        res.status(200).send({ answer });
    }
    static async postAdvice(req, res) {
        const { actorCategory, actorId } = abstract_1.AbstractController._host(req);
        const body = abstract_1.AbstractController._body(req);
        if (!(body === null || body === void 0 ? void 0 : body.type) || !actorCategory || typeof actorId === 'undefined') {
            abstract_1.AbstractController._badRequest(res, 'needs a advice type, actor category and id');
            return;
        }
        let advices = [];
        try {
            const adviceType = body.type;
            if (adviceType === advice_1.AdviceType.UPDATE) {
                advices = await advice_1.AdviceStatics.AskToUpdate('admin', 0, body.category);
                if (advices.length === 0) {
                    abstract_1.AbstractController._badRequest(res, 'needs a valid sender and advice');
                    return;
                }
            }
        }
        catch (e) {
            abstract_1.AbstractController._internalProblem(res, e);
            return;
        }
        res.status(200).send({ advices });
    }
    static async loadAdviceId(req, res, next, _id) {
        try {
            req['loadedAdvice'] = await advice_1.AdviceModel.findById(_id);
            next();
        }
        catch (err) {
            abstract_1.AbstractController._notFound(res, 'Need a valid adviceId');
        }
    }
    static async putAdvice(req, res) {
        const { actorCategory, actorId } = abstract_1.AbstractController._host(req);
        const body = abstract_1.AbstractController._body(req);
        if (!(body === null || body === void 0 ? void 0 : body.status) || !actorCategory || typeof actorId === 'undefined') {
            abstract_1.AbstractController._badRequest(res, 'needs a advice status, actor category and id');
            return;
        }
        const advice = { id: 'na', type: 'na' };
        try {
            const adviceFound = req['loadedAdvice'];
            advice.id = adviceFound.id;
            advice.type = adviceFound.type;
            adviceFound.status = body.status;
            await adviceFound.save();
        }
        catch (e) {
            abstract_1.AbstractController._internalProblem(res, e);
            return;
        }
        res.status(200).send({ advice });
    }
    static async getAdvices(req, res) {
        const { actorCategory, actorId } = abstract_1.AbstractController._host(req);
        if (!actorCategory || typeof actorId === 'undefined') {
            abstract_1.AbstractController._badRequest(res, 'needs an actor category and id');
            return;
        }
        try {
            const advices = await advice_1.AdviceStatics.GetTrickyAdvices(actorCategory, actorId);
            if (advices.length === 0) {
                res.status(404).type('application/json').send();
                return;
            }
            res.status(200).type('application/json').send({ advices });
        }
        catch (e) {
            abstract_1.AbstractController._internalProblem(res, e);
        }
    }
    static async Update() {
        logger_1.logger.warn('#UPDATE app with "npm run update"...');
        return 'TODO be careful';
        npm_run_1.default.exec('npm run update', {}, async (err, stdout, stderr) => {
            logger_1.logger.warn(`#UPDATE ${process.pid} update: `, err, stdout, stderr);
            process.exit(0);
        });
    }
}
exports.AdminController = AdminController;
//# sourceMappingURL=admin.js.map