"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorModel = exports.ActorStatics = exports.ActorMethods = exports.ActorAnswer = exports.ActorQuestion = exports.ActorSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.ActorSchema = {
    actorCategory: { type: String, required: 'Actor category needed', index: true }, // don't be offended
    actorId: { type: Number, required: 'Actor id needed', index: true }, // again no judgment
    actorAddress: { type: String }, // To call you back
    weight: { type: Number, default: 1 }, // again no judgment (but 1 is worst)
    alivePeriodInSec: { type: Number, default: 100 }, // we consider you alive until ?
    isPrincipal: { type: Boolean, default: false, index: true }, // Flagged during the High Five
    version: { type: String }, // are you up-to-date ?
    last100Errors: [String], // last logs...
};
const schema = new mongoose_1.default.Schema(exports.ActorSchema, { timestamps: true });
const after60minutes = 60 * 60; // equivalent in sec
schema.index({ createdAt: -1 }, { expireAfterSeconds: after60minutes });
schema.index({ updatedAt: -1 });
var ActorQuestion;
(function (ActorQuestion) {
    ActorQuestion["PRINCIPAL"] = "have I the principal role for my category ?";
    ActorQuestion["ADDRESS_ALL"] = "what is all actors (from a category) addresses ?";
    ActorQuestion["ADDRESS_PRINCIPAL"] = "what is principal actor (from a category) address ?";
})(ActorQuestion || (exports.ActorQuestion = ActorQuestion = {}));
var ActorAnswer;
(function (ActorAnswer) {
    ActorAnswer["yes"] = "yes";
    ActorAnswer["no"] = "no";
})(ActorAnswer || (exports.ActorAnswer = ActorAnswer = {}));
exports.ActorMethods = {};
exports.ActorStatics = {
    async PushHighFive(actorCategory, actorId, actorAddress, hi) {
        const answer = await exports.ActorStatics.HaveAPrincipalRole(actorCategory, actorId);
        const isPrincipal = answer === ActorAnswer.yes;
        const actor = new exports.ActorModel({
            actorCategory,
            actorId,
            weight: hi.weight,
            alivePeriodInSec: hi.alivePeriodInSec,
            version: hi.version,
            isPrincipal,
            actorAddress,
            last100Errors: hi.last100Errors,
        });
        await actor.save();
        return actor;
    },
    async _getLastActorsFromCategory(actorCategory) {
        const lastActorsFromType = await exports.ActorModel.find({ actorCategory })
            .sort({ createdAt: -1 })
            .limit(1000);
        const lastActors = {};
        for (const actor of lastActorsFromType) {
            if (typeof lastActors[actor.actorId] === 'undefined') {
                lastActors[actor.actorId] = actor;
            }
        }
        return lastActors;
    },
    async _filterAliveActors(actors) {
        const now = new Date();
        const aliveActors = [];
        let maxAliveWeight = 0;
        for (const id of Object.keys(actors)) {
            const actor = actors[id];
            const alive = actor.createdAt.getTime() - now.getTime() + actor.alivePeriodInSec * 1000;
            if (alive >= 0) {
                aliveActors.push(actor);
                maxAliveWeight = Math.max(maxAliveWeight, actor.weight);
            }
        }
        return { aliveActors, maxAliveWeight };
    },
    async HaveAPrincipalRole(actorCategory, actorId) {
        const lastActors = await this._getLastActorsFromCategory(actorCategory);
        const { aliveActors, maxAliveWeight } = await this._filterAliveActors(lastActors);
        if (aliveActors.length === 0) {
            return ActorAnswer.yes;
        }
        const foundCurrentActorAsAlive = aliveActors.filter((a) => a.actorId === actorId);
        if (foundCurrentActorAsAlive.length !== 1) {
            return ActorAnswer.no;
        }
        // Is actor flagged as principal before ? if yes => yes
        const currentActor = foundCurrentActorAsAlive[0];
        if (currentActor.isPrincipal) {
            return ActorAnswer.yes;
        }
        // Is actor part of the heaviest ? if no => no
        if (currentActor.weight < maxAliveWeight) {
            return ActorAnswer.no;
        }
        // Is another actor is alive ? if yes => no
        if (aliveActors.length > 1) {
            return ActorAnswer.no;
        }
        // Else => yes
        return ActorAnswer.yes;
    },
    async GetLastActor(actorCategory, actorId) {
        const actors = await exports.ActorModel.find({ actorCategory, actorId })
            .sort({ createdAt: -1 })
            .limit(1000);
        if (actors.length > 0) {
            return actors[0];
        }
        return null;
    },
    async GetAllCategories() {
        const lastActors = await exports.ActorModel.find().sort({ createdAt: -1 }).limit(1000);
        const categories = new Set();
        for (const actor of lastActors) {
            categories.add('' + actor.actorCategory);
        }
        return Array.from(categories);
    },
    async GetAllActorsFromCategorySortedByWeight(actorCategory) {
        const lastActors = await this._getLastActorsFromCategory(actorCategory);
        const { aliveActors } = await this._filterAliveActors(lastActors);
        return aliveActors.sort((a, b) => a.weight - b.weight);
    },
    async GetPrincipalActorFromCategory(actorCategory) {
        const lastActors = await this._getLastActorsFromCategory(actorCategory);
        const { aliveActors } = await this._filterAliveActors(lastActors);
        const principals = aliveActors.filter((a) => a.isPrincipal);
        if (principals.length === 1) {
            return principals[0];
        }
        return null;
    },
};
schema.methods = exports.ActorMethods;
schema.statics = exports.ActorStatics;
exports.ActorModel = mongoose_1.default.model('Actor', schema);
//# sourceMappingURL=actor.js.map