"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusModel = exports.StatusStatics = exports.StatusMethods = exports.StatusSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../config");
const cache_1 = require("../factories/cache");
exports.StatusSchema = {
    json: { type: String, default: '{}' }, // all the details
};
const schema = new mongoose_1.default.Schema(exports.StatusSchema, { timestamps: true });
const after30days = 30 * 24 * 60 * 60; // equivalent in sec
schema.index({ createdAt: -1 }, { expireAfterSeconds: after30days });
schema.index({ updatedAt: -1 });
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
exports.StatusMethods = {};
exports.StatusStatics = {
    async BuildSummarizedStatus(version) {
        const ok = true;
        const status = {
            version,
            env: '' + config_1.config.deploy.env,
            cache: {
                store: cache_1.cacheStore,
                ok: cache_1.cacheFactory.isOk(),
            },
            ok
        };
        exports.StatusStatics.StoreStatus(status).then(ignored => {
        });
        return status;
    },
    async StoreStatus(details) {
        const json = JSON.stringify(details);
        const rec = new exports.StatusModel({ json });
        return rec.save();
    },
};
schema.methods = exports.StatusMethods;
schema.statics = exports.StatusStatics;
exports.StatusModel = mongoose_1.default.model('Status', schema);
//# sourceMappingURL=status.js.map