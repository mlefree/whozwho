import mongoose, {Schema} from 'mongoose';
import {ActorStatics} from './actor';

export enum AdviceType {
    UPDATE = 'you need an update',
}

export enum AdviceStatus {
    TODO = 'toDo',
    ONGOING = 'onGoing',
    DONE = 'done',
}

export const AdviceSchema: any = {
    type: {type: String, required: 'AdviceType needed', index: true},
    fromActor: {type: Schema.Types.ObjectId, ref: 'Actor'},
    toActorId: {type: Number, index: true},
    toActorCategory: {type: String, index: true},
    status: {type: String, default: AdviceStatus.TODO},
};

const schema = new mongoose.Schema(AdviceSchema, {timestamps: true});

const after60minutes = 60 * 60; // equivalent in sec
schema.index({createdAt: -1}, {expireAfterSeconds: after60minutes});
schema.index({updatedAt: -1});

export const AdviceMethods = {};

export const AdviceStatics = {
    async _getAndValidateActor(actorCategory: string, actorId: number) {
        const actor = await ActorStatics.GetLastActor(actorCategory, actorId);
        if (!actor) {
            return null;
        }
        return actor;
    },

    async _findAdvicesByActorCriteria(actorId: number, actorCategory: string, status: AdviceStatus) {
        return AdviceModel.find({
            toActorId: actorId,
            toActorCategory: actorCategory,
            status
        }).sort({createdAt: -1});
    },

    async _findOrCreateAdvice(fromActor: any, toActorId: number, toActorCategory: string, type: AdviceType, status: AdviceStatus) {
        const adviceFound = await AdviceModel.findOne({
            type,
            fromActor,
            toActorId,
            toActorCategory,
            status
        });
        if (adviceFound) {
            return adviceFound;
        }

        const adviceCreated = new AdviceModel({
            type,
            fromActor,
            toActorId,
            toActorCategory,
            status
        });
        await adviceCreated.save();
        return {id: adviceCreated.id, type: adviceCreated.type};
    },

    async AskToUpdate(fromActorCategory: string, fromActorId: number, toCategory?: string) {
        const advices: { id: string, type: string }[] = [];
        const fromActor = await this._getAndValidateActor(fromActorCategory, fromActorId);

        const actorCategories = await ActorStatics.GetAllCategories();
        for (const actorCategory of actorCategories) {
            if (!!toCategory && actorCategory !== toCategory) continue;

            const actors = await ActorStatics.GetAllActorsFromCategorySortedByWeight(actorCategory);
            if (actors.length === 0) continue;

            const currentPos = actors.map(a => a.id).indexOf(fromActor?.id);
            let toActorId = actors[0].actorId;
            let toActorCategory = actors[0].actorCategory;

            if (currentPos > -1) {
                const nextPos = currentPos + 1;
                if (nextPos >= actors.length) continue;

                toActorId = actors[nextPos].actorId;
                toActorCategory = actors[nextPos].actorCategory;
            }

            const advice = await this._findOrCreateAdvice(
                fromActor,
                toActorId,
                toActorCategory,
                AdviceType.UPDATE,
                AdviceStatus.TODO
            );
            advices.push(advice);
        }

        return advices;
    },

    async GetTrickyAdvices(actorCategory: string, actorId: number) {
        const actor = await this._getAndValidateActor(actorCategory, actorId);
        if (!actor) return null;

        const advices = await this._findAdvicesByActorCriteria(
            actor.actorId,
            actor.actorCategory,
            AdviceStatus.TODO
        );

        return advices.map(a => ({id: a.id, type: a.type}));
    },

    async FinishPotentialOngoingAdvices(actorCategory: string, actorId: number) {
        const actor = await this._getAndValidateActor(actorCategory, actorId);
        if (!actor) return null;

        const updated = await AdviceModel
            .updateMany(
                {
                    toActorId: actor.actorId,
                    toActorCategory: actor.actorCategory,
                    status: AdviceStatus.ONGOING
                },
                {status: AdviceStatus.DONE}
            ).exec();

        if (updated?.modifiedCount) {
            await this.AskToUpdate(actorCategory, actorId, actorCategory);
        }
    },

    async OnGoingAdvicesCount() {
        return await AdviceModel
            .count(
                {status: AdviceStatus.TODO}
            ).exec();
    }
};

schema.methods = AdviceMethods;
schema.statics = AdviceStatics;
export const AdviceModel = mongoose.model('Advice', schema);
