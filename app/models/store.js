"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreModel = exports.StoreStatics = exports.StoreSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.StoreSchema = {
    category: { type: String, required: 'Category needed', index: true },
    namespace: { type: String, required: 'Namespace needed', index: true },
    version: { type: Number, default: 1 },
    data: { type: mongoose_1.default.Schema.Types.Mixed, default: {} },
};
const schema = new mongoose_1.default.Schema(exports.StoreSchema, { timestamps: true });
schema.index({ category: 1, namespace: 1 }, { unique: true });
exports.StoreStatics = {
    async Get(category, namespace) {
        const doc = await exports.StoreModel.findOne({ category, namespace });
        if (!doc) {
            return null;
        }
        return { version: doc.get('version'), data: doc.get('data') };
    },
    async Put(category, namespace, data) {
        const doc = await exports.StoreModel.findOneAndUpdate({ category, namespace }, { $set: { data }, $inc: { version: 1 } }, { upsert: true, new: true, setDefaultsOnInsert: true });
        return { version: doc.get('version') };
    },
    async GetVersions(category) {
        const docs = await exports.StoreModel.find({ category }, { namespace: 1, version: 1 });
        const versions = {};
        for (const doc of docs) {
            versions[doc.get('namespace')] = doc.get('version');
        }
        return versions;
    },
};
schema.statics = exports.StoreStatics;
exports.StoreModel = mongoose_1.default.model('Store', schema);
//# sourceMappingURL=store.js.map