import mongoose from 'mongoose';
export declare enum AdviceType {
    UPDATE = "you need an update"
}
export declare enum AdviceStatus {
    TODO = "toDo",
    ONGOING = "onGoing",
    DONE = "done"
}
export declare const AdviceSchema: any;
export declare const AdviceMethods: {};
export declare const AdviceStatics: {
    _getAndValidateActor(actorCategory: string, actorId: number): Promise<any>;
    _findAdvicesByActorCriteria(actorId: number, actorCategory: string, status: AdviceStatus): Promise<any[]>;
    _findOrCreateAdvice(fromActor: any, toActorId: number, toActorCategory: string, type: AdviceType, status: AdviceStatus): Promise<any>;
    AskToUpdate(fromActorCategory: string, fromActorId: number, toCategory?: string): Promise<{
        id: string;
        type: string;
    }[]>;
    GetTrickyAdvices(actorCategory: string, actorId: number): Promise<any>;
    FinishPotentialOngoingAdvices(actorCategory: string, actorId: number): Promise<any>;
};
export declare const AdviceModel: mongoose.Model<any, {}, {}, {}, any, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, any, mongoose.Document<unknown, {}, mongoose.FlatRecord<any>> & mongoose.FlatRecord<any> & Required<{
    _id: unknown;
}>>>;
