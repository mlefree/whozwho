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
    weight: { type: Number, default: 1 }, // ...
    alivePeriodInSec: { type: Number, default: 100 }, // ...
    version: { type: String },
    last100Errors: [String],
};
const schema = new mongoose_1.default.Schema(exports.ActorSchema, { timestamps: true });
schema.index({ createdAt: -1 });
schema.index({ updatedAt: -1 });
var ActorQuestion;
(function (ActorQuestion) {
    ActorQuestion["PRINCIPAL"] = "have I the principal role for my category ?";
})(ActorQuestion || (exports.ActorQuestion = ActorQuestion = {}));
var ActorAnswer;
(function (ActorAnswer) {
    ActorAnswer["yes"] = "yes";
    ActorAnswer["no"] = "no";
})(ActorAnswer || (exports.ActorAnswer = ActorAnswer = {}));
exports.ActorMethods = {};
exports.ActorStatics = {
    async PushHighFive(actorCategory, actorId, hi) {
        const actor = new exports.ActorModel({
            actorCategory,
            actorId,
            weight: hi.weight,
            alivePeriodInSec: hi.alivePeriodInSec,
            version: hi.version,
            last100Errors: hi.last100Errors,
        });
        await actor.save();
        return actor;
    },
    async _getLastActorsFromCategory(actorCategory) {
        const lastActorsFromType = await exports.ActorModel.find({ actorCategory })
            .sort({ createdAt: -1 }).limit(1000);
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
        if (typeof lastActors[actorId] === 'undefined') {
            return ActorAnswer.no;
        }
        const { aliveActors, maxAliveWeight } = await this._filterAliveActors(lastActors);
        const foundCurrentActorAsAlive = aliveActors.filter(a => a.actorId === actorId);
        if (foundCurrentActorAsAlive.length !== 1) {
            return ActorAnswer.no;
        }
        // Is actor part of the heaviest ? if no => no
        const currentActor = foundCurrentActorAsAlive[0];
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
            .sort({ createdAt: -1 }).limit(1000);
        if (actors.length > 0) {
            return actors[0];
        }
        return null;
    },
    async GetAllCategories() {
        const lastActors = await exports.ActorModel.find()
            .sort({ createdAt: -1 }).limit(1000);
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
    }
};
schema.methods = exports.ActorMethods;
schema.statics = exports.ActorStatics;
exports.ActorModel = mongoose_1.default.model('Actor', schema);
//# sourceMappingURL=actor.js.map