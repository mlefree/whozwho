import mongoose from 'mongoose';
export declare const StatusSchema: Record<string, mongoose.SchemaDefinitionProperty<unknown>>;
export declare const StatusMethods: {};
export declare const StatusStatics: {
    BuildSummarizedStatus(version: string): Promise<{
        version: string;
        env: string;
        cache: {
            store: import("mle-tools-node").CACHE_STORE;
            ok: boolean;
        };
        ok: boolean;
    }>;
    StoreStatus(details: {
        version: string;
        env: string;
        cache: {
            store: unknown;
            ok: boolean;
        };
        ok: boolean;
        [key: string]: unknown;
    }): Promise<mongoose.Document<unknown, {}, {
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
    }>;
};
export declare const StatusModel: mongoose.Model<{
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
