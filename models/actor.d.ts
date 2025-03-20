import mongoose from 'mongoose';
export declare const ActorSchema: any;
export declare enum ActorQuestion {
    PRINCIPAL = "have I the principal role for my category ?"
}
export declare enum ActorAnswer {
    yes = "yes",
    no = "no"
}
export declare const ActorMethods: {};
export declare const ActorStatics: {
    PushHighFive(actorCategory: string, actorId: number, hi: {
        weight: number;
        alivePeriodInSec: number;
        version: string;
        last100Errors: string[];
    }): Promise<any>;
    _getLastActorsFromCategory(actorCategory: string): Promise<{}>;
    _filterAliveActors(actors: Record<string, any>): Promise<{
        aliveActors: any[];
        maxAliveWeight: number;
    }>;
    HaveAPrincipalRole(actorCategory: string, actorId: number): Promise<ActorAnswer>;
    GetLastActor(actorCategory: string, actorId: number): Promise<any>;
    GetAllCategories(): Promise<string[]>;
    GetAllActorsFromCategorySortedByWeight(actorCategory: string): Promise<any>;
};
export declare const ActorModel: mongoose.Model<any, {}, {}, {}, any, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, any, mongoose.Document<unknown, {}, mongoose.FlatRecord<any>> & mongoose.FlatRecord<any> & Required<{
    _id: unknown;
}>>>;
