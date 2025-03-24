import mongoose from 'mongoose';
export declare const StatusSchema: any;
export declare const StatusMethods: {};
export declare const StatusStatics: {
    BuildSummarizedStatus(version: string): Promise<{
        version: string;
        env: string;
        cache: boolean;
        ok: boolean;
    }>;
    StoreStatus(status: any): Promise<any>;
};
export declare const StatusModel: mongoose.Model<any, {}, {}, {}, any, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, any, mongoose.Document<unknown, {}, mongoose.FlatRecord<any>> & mongoose.FlatRecord<any> & Required<{
    _id: unknown;
}>>>;
