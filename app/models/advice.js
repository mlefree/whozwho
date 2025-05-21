"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdviceModel = exports.AdviceStatics = exports.AdviceMethods = exports.AdviceSchema = exports.AdviceStatus = exports.AdviceType = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const actor_1 = require("./actor");
var AdviceType;
(function (AdviceType) {
    AdviceType["UPDATE"] = "you need an update";
})(AdviceType || (exports.AdviceType = AdviceType = {}));
var AdviceStatus;
(function (AdviceStatus) {
    AdviceStatus["TODO"] = "toDo";
    AdviceStatus["ONGOING"] = "onGoing";
    AdviceStatus["DONE"] = "done";
})(AdviceStatus || (exports.AdviceStatus = AdviceStatus = {}));
exports.AdviceSchema = {
    type: { type: String, required: 'AdviceType needed', index: true },
    fromActor: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Actor' },
    toActorId: { type: Number, index: true },
    toActorCategory: { type: String, index: true },
    status: { type: String, default: AdviceStatus.TODO },
};
const schema = new mongoose_1.default.Schema(exports.AdviceSchema, { timestamps: true });
const after60minutes = 60 * 60; // equivalent in sec
schema.index({ createdAt: -1 }, { expireAfterSeconds: after60minutes });
schema.index({ updatedAt: -1 });
exports.AdviceMethods = {};
exports.AdviceStatics = {
    async _getAndValidateActor(actorCategory, actorId) {
        const actor = await actor_1.ActorStatics.GetLastActor(actorCategory, actorId);
        if (!actor) {
            return null;
        }
        return actor;
    },
    async _findAdvicesByActorCriteria(actorId, actorCategory, status) {
        return exports.AdviceModel.find({
            toActorId: actorId,
            toActorCategory: actorCategory,
            status
        }).sort({ createdAt: -1 });
    },
    async _findOrCreateAdvice(fromActor, toActorId, toActorCategory, type, status) {
        const adviceFound = await exports.AdviceModel.findOne({
            type,
            fromActor,
            toActorId,
            toActorCategory,
            status
        });
        if (adviceFound) {
            return adviceFound;
        }
        const adviceCreated = new exports.AdviceModel({
            type,
            fromActor,
            toActorId,
            toActorCategory,
            status
        });
        await adviceCreated.save();
        return { id: adviceCreated.id, type: adviceCreated.type };
    },
    async AskToUpdate(fromActorCategory, fromActorId, toCategory) {
        const advices = [];
        const fromActor = await this._getAndValidateActor(fromActorCategory, fromActorId);
        const actorCategories = await actor_1.ActorStatics.GetAllCategories();
        for (const actorCategory of actorCategories) {
            if (!!toCategory && actorCategory !== toCategory)
                continue;
            const actors = await actor_1.ActorStatics.GetAllActorsFromCategorySortedByWeight(actorCategory);
            if (actors.length === 0)
                continue;
            const currentPos = actors.map(a => a.id).indexOf(fromActor === null || fromActor === void 0 ? void 0 : fromActor.id);
            let toActorId = actors[0].actorId;
            let toActorCategory = actors[0].actorCategory;
            if (currentPos > -1) {
                const nextPos = currentPos + 1;
                if (nextPos >= actors.length)
                    continue;
                toActorId = actors[nextPos].actorId;
                toActorCategory = actors[nextPos].actorCategory;
            }
            const advice = await this._findOrCreateAdvice(fromActor, toActorId, toActorCategory, AdviceType.UPDATE, AdviceStatus.TODO);
            advices.push(advice);
        }
        return advices;
    },
    async GetTrickyAdvices(actorCategory, actorId) {
        const actor = await this._getAndValidateActor(actorCategory, actorId);
        if (!actor)
            return null;
        const advices = await this._findAdvicesByActorCriteria(actor.actorId, actor.actorCategory, AdviceStatus.TODO);
        return advices.map(a => ({ id: a.id, type: a.type }));
    },
    async FinishPotentialOngoingAdvices(actorCategory, actorId) {
        const actor = await this._getAndValidateActor(actorCategory, actorId);
        if (!actor)
            return null;
        const updated = await exports.AdviceModel
            .updateMany({
            toActorId: actor.actorId,
            toActorCategory: actor.actorCategory,
            status: AdviceStatus.ONGOING
        }, { status: AdviceStatus.DONE }).exec();
        if (updated === null || updated === void 0 ? void 0 : updated.modifiedCount) {
            await this.AskToUpdate(actorCategory, actorId, actorCategory);
        }
    },
    async OnGoingAdvicesCount() {
        return await exports.AdviceModel
            .count({ status: AdviceStatus.TODO }).exec();
    }
};
schema.methods = exports.AdviceMethods;
schema.statics = exports.AdviceStatics;
exports.AdviceModel = mongoose_1.default.model('Advice', schema);
//# sourceMappingURL=advice.js.map