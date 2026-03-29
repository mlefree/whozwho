import mongoose from 'mongoose';

export const StoreSchema: Record<string, mongoose.SchemaDefinitionProperty<unknown>> = {
    category: {type: String, required: 'Category needed', index: true},
    namespace: {type: String, required: 'Namespace needed', index: true},
    version: {type: Number, default: 1},
    data: {type: mongoose.Schema.Types.Mixed, default: {}},
};

const schema = new mongoose.Schema(StoreSchema, {timestamps: true});
schema.index({category: 1, namespace: 1}, {unique: true});

export const StoreStatics = {
    async Get(category: string, namespace: string) {
        const doc = await StoreModel.findOne({category, namespace});
        if (!doc) {
            return null;
        }
        return {version: doc.get('version'), data: doc.get('data')};
    },

    async Put(category: string, namespace: string, data: unknown) {
        const doc = await StoreModel.findOneAndUpdate(
            {category, namespace},
            {$set: {data}, $inc: {version: 1}},
            {upsert: true, new: true, setDefaultsOnInsert: true}
        );
        return {version: doc.get('version')};
    },

    async GetVersions(category: string): Promise<Record<string, number>> {
        const docs = await StoreModel.find({category}, {namespace: 1, version: 1});
        const versions: Record<string, number> = {};
        for (const doc of docs) {
            versions[doc.get('namespace')] = doc.get('version');
        }
        return versions;
    },
};

schema.statics = StoreStatics;
export const StoreModel = mongoose.model('Store', schema);
