import mongoose from 'mongoose';
export declare enum AdviceType {
    UPDATE = "you need an update"
}
export declare enum AdviceStatus {
    TODO = "toDo",
    ONGOING = "onGoing",
    DONE = "done"
}
export declare const AdviceSchema: Record<string, mongoose.SchemaDefinitionProperty<unknown>>;
export declare const AdviceMethods: {};
export declare const AdviceStatics: {
    _getAndValidateActor(actorCategory: string, actorId: number): Promise<mongoose.Document<unknown, {}, {
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
    _findAdvicesByActorCriteria(actorId: number, actorCategory: string, status: AdviceStatus): Promise<(mongoose.Document<unknown, {}, {
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
    })[]>;
    _findOrCreateAdvice(fromActor: mongoose.Types.ObjectId | mongoose.Document, toActorId: number, toActorCategory: string, type: AdviceType, status: AdviceStatus): Promise<(mongoose.Document<unknown, {}, {
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
    }) | {
        id: any;
        type: any;
    }>;
    AskToUpdate(fromActorCategory: string, fromActorId: number, toCategory?: string): Promise<{
        id: string;
        type: string;
    }[]>;
    GetTrickyAdvices(actorCategory: string, actorId: number): Promise<any>;
    FinishPotentialOngoingAdvices(actorCategory: string, actorId: number): Promise<any>;
    toDoAdvicesCount(): Promise<number>;
};
export declare const AdviceModel: mongoose.Model<{
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
