import mongoose from 'mongoose';

export const ActorSchema: any = {
    hostname: {type: String, required: 'hostname needed', index: true},
    type: {type: String, required: 'type needed', index: true}, // => summarize, advanced, processor, purge
    processor: {type: String, index: true}, // if processor => name
    json: {type: String, default: '{}'},    // all the details
};

const schema = new mongoose.Schema(ActorSchema, {timestamps: true});

schema.index({createdAt: -1});
schema.index({updatedAt: -1});

export const ActorMethods = {};

export const ActorStatics = {};

schema.methods = ActorMethods;
schema.statics = ActorStatics;
export const ActorModel = mongoose.model('Actor', schema);
