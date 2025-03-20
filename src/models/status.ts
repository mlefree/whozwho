import mongoose from 'mongoose';
import {config} from '../config';
import {cacheFactory} from 'mle-tools-node';

export const StatusSchema: any = {
    hostname: {type: String, required: 'hostname needed', index: true},
    type: {type: String, required: 'type needed', index: true}, // => summarize, advanced, processor, purge
    processor: {type: String, index: true}, // if processor => name
    json: {type: String, default: '{}'},    // all the details
};

const schema = new mongoose.Schema(StatusSchema, {timestamps: true});

const after30days = 30 * 24 * 60 * 60; // equivalent in sec
schema.index({createdAt: -1}, {expireAfterSeconds: after30days});
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
            env: '' + config.deploy.env,
            cache: cacheFactory.isOk(),
            ok
        };
        StatusStatics.StoreStatus(status).then(ignored => {
        });
        return status;
    },

    async StoreStatus(status: any) {
        const rec = new StatusModel(status);
        return rec.save();
    },

};

schema.methods = StatusMethods;
schema.statics = StatusStatics;
export const StatusModel = mongoose.model('Status', schema);
