import mongoose from 'mongoose';
import {whozwhoConfig} from '../config';
import {cacheFactory, cacheStore} from '../factories/cache';

export const StatusSchema: Record<string, mongoose.SchemaDefinitionProperty<unknown>> = {
    json: {type: String, default: '{}'}, // all the details
};

const schema = new mongoose.Schema(StatusSchema, {timestamps: true});

const after60minutes = 60 * 60; // equivalent in sec
schema.index({createdAt: -1}, {expireAfterSeconds: after60minutes});
schema.index({updatedAt: -1});

schema.set('toJSON', {
    getters: true,
    transform: (doc, ret) => {
        delete ret.__v;
        delete ret._id;
        const json = JSON.parse(ret.json);
        json.date = ret.createdAt;
        return json;
    },
});

export const StatusMethods = {};

export const StatusStatics = {
    async BuildSummarizedStatus(version: string) {
        const ok = true;
        const status = {
            version,
            env: '' + whozwhoConfig.deploy.env,
            cache: {
                store: cacheStore,
                ok: cacheFactory.isOk(),
            },
            ok,
        };
        StatusStatics.StoreStatus(status).then((ignored) => {});
        return status;
    },

    async StoreStatus(details: {
        version: string;
        env: string;
        cache: {
            store: unknown;
            ok: boolean;
        };
        ok: boolean;
        [key: string]: unknown;
    }) {
        const json = JSON.stringify(details);
        const rec = new StatusModel({json});
        return rec.save();
    },
};

schema.methods = StatusMethods;
schema.statics = StatusStatics;
export const StatusModel = mongoose.model('Status', schema);
