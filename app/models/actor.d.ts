import mongoose from 'mongoose';
export declare const ActorSchema: Record<string, mongoose.SchemaDefinitionProperty<unknown>>;
export declare enum ActorQuestion {
    PRINCIPAL = "have I the principal role for my category ?",
    ADDRESS_ALL = "what is all actors (from a category) addresses ?",
    ADDRESS_PRINCIPAL = "what is principal actor (from a category) address ?"
}
export declare enum ActorAnswer {
    yes = "yes",
    no = "no"
}
export declare const ActorMethods: {};
export declare const ActorStatics: {
    PushHighFive(actorCategory: string, actorId: number, actorAddress: string, hi: {
        weight: number;
        alivePeriodInSec: number;
        version: string;
        last100Errors: string[];
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
    _getLastActorsFromCategory(actorCategory: string): Promise<{}>;
    _filterAliveActors(actors: Record<string, {
        actorId: number;
        actorCategory: string;
        actorAddress?: string;
        weight: number;
        alivePeriodInSec: number;
        isPrincipal: boolean;
        version?: string;
        last100Errors?: string[];
        createdAt: Date;
    }>): Promise<{
        aliveActors: {
            actorId: number;
            actorCategory: string;
            actorAddress?: string;
            weight: number;
            alivePeriodInSec: number;
            isPrincipal: boolean;
            version?: string;
            last100Errors?: string[];
            createdAt: Date;
        }[];
        maxAliveWeight: number;
    }>;
    HaveAPrincipalRole(actorCategory: string, actorId: number): Promise<ActorAnswer>;
    GetLastActor(actorCategory: string, actorId: number): Promise<mongoose.Document<unknown, {}, {
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
    GetAllCategories(): Promise<string[]>;
    GetAllActorsFromCategorySortedByWeight(actorCategory: string): Promise<any>;
    GetPrincipalActorFromCategory(actorCategory: string): Promise<any>;
};
export declare const ActorModel: mongoose.Model<{
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
