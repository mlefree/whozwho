import mongoose from 'mongoose';

export const ActorSchema: Record<string, mongoose.SchemaDefinitionProperty<unknown>> = {
    actorCategory: {type: String, required: 'Actor category needed', index: true}, // don't be offended
    actorId: {type: Number, required: 'Actor id needed', index: true}, // again no judgment
    actorAddress: {type: String}, // To call you back
    weight: {type: Number, default: 1}, // again no judgment (but 1 is worst)
    alivePeriodInSec: {type: Number, default: 100}, // we consider you alive until ?
    isPrincipal: {type: Boolean, default: false, index: true}, // Flagged during the High Five
    version: {type: String}, // are you up-to-date ?
    last100Errors: [String], // last logs...
};

const schema = new mongoose.Schema(ActorSchema, {timestamps: true});

const after60minutes = 60 * 60; // equivalent in sec
schema.index({createdAt: -1}, {expireAfterSeconds: after60minutes});
schema.index({updatedAt: -1});

export enum ActorQuestion {
    PRINCIPAL = 'have I the principal role for my category ?',
    ADDRESS_ALL = 'what is all actors (from a category) addresses ?',
    ADDRESS_PRINCIPAL = 'what is principal actor (from a category) address ?',
}

export enum ActorAnswer {
    yes = 'yes',
    no = 'no',
}

export const ActorMethods = {};

export const ActorStatics = {
    async PushHighFive(
        actorCategory: string,
        actorId: number,
        actorAddress: string,
        hi: {weight: number; alivePeriodInSec: number; version: string; last100Errors: string[]}
    ) {
        const answer = await ActorStatics.HaveAPrincipalRole(actorCategory, actorId);
        const isPrincipal = answer === ActorAnswer.yes;

        const actor = new ActorModel({
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

    async _getLastActorsFromCategory(actorCategory: string) {
        const lastActorsFromType = await ActorModel.find({actorCategory})
            .sort({createdAt: -1})
            .limit(1000);

        const lastActors = {};
        for (const actor of lastActorsFromType) {
            if (typeof lastActors[actor.actorId] === 'undefined') {
                lastActors[actor.actorId] = actor;
            }
        }
        return lastActors;
    },

    async _filterAliveActors(
        actors: Record<
            string,
            {
                actorId: number;
                actorCategory: string;
                actorAddress?: string;
                weight: number;
                alivePeriodInSec: number;
                isPrincipal: boolean;
                version?: string;
                last100Errors?: string[];
                createdAt: Date;
            }
        >
    ) {
        const now = new Date();
        const aliveActors: {
            actorId: number;
            actorCategory: string;
            actorAddress?: string;
            weight: number;
            alivePeriodInSec: number;
            isPrincipal: boolean;
            version?: string;
            last100Errors?: string[];
            createdAt: Date;
        }[] = [];
        let maxAliveWeight = 0;

        for (const id of Object.keys(actors)) {
            const actor = actors[id];
            const alive = actor.createdAt.getTime() - now.getTime() + actor.alivePeriodInSec * 1000;
            if (alive >= 0) {
                aliveActors.push(actor);
                maxAliveWeight = Math.max(maxAliveWeight, actor.weight);
            }
        }

        return {aliveActors, maxAliveWeight};
    },

    async HaveAPrincipalRole(actorCategory: string, actorId: number) {
        const lastActors = await this._getLastActorsFromCategory(actorCategory);
        const {aliveActors, maxAliveWeight} = await this._filterAliveActors(lastActors);
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

    async GetLastActor(actorCategory: string, actorId: number) {
        const actors = await ActorModel.find({actorCategory, actorId})
            .sort({createdAt: -1})
            .limit(1000);

        if (actors.length > 0) {
            return actors[0];
        }

        return null;
    },

    async GetAllCategories() {
        const lastActors = await ActorModel.find().sort({createdAt: -1}).limit(1000);

        const categories = new Set();
        for (const actor of lastActors) {
            categories.add('' + actor.actorCategory);
        }

        return Array.from(categories) as string[];
    },

    async GetAllActorsFromCategorySortedByWeight(actorCategory: string) {
        const lastActors = await this._getLastActorsFromCategory(actorCategory);
        const {aliveActors} = await this._filterAliveActors(lastActors);
        return aliveActors.sort((a, b) => a.weight - b.weight);
    },

    async GetPrincipalActorFromCategory(actorCategory: string) {
        const lastActors = await this._getLastActorsFromCategory(actorCategory);
        const {aliveActors} = await this._filterAliveActors(lastActors);
        const principals = aliveActors.filter((a) => a.isPrincipal);
        if (principals.length === 1) {
            return principals[0];
        }
        return null;
    },
};

schema.methods = ActorMethods;
schema.statics = ActorStatics;
export const ActorModel = mongoose.model('Actor', schema);
