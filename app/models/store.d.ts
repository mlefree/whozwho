import mongoose from 'mongoose';
export declare const StoreSchema: Record<string, mongoose.SchemaDefinitionProperty<unknown>>;
export declare const StoreStatics: {
    Get(category: string, namespace: string): Promise<{
        version: any;
        data: any;
    }>;
    Put(category: string, namespace: string, data: unknown): Promise<{
        version: any;
    }>;
    GetVersions(category: string): Promise<Record<string, number>>;
};
export declare const StoreModel: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    [x: string]: any;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    [x: string]: any;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    [x: string]: any;
} & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    [x: string]: any;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    [x: string]: any;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    [x: string]: any;
}> & {
    _id: mongoose.Types.ObjectId;
}>>;
